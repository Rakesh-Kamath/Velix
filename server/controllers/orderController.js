import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialize Razorpay client only when needed
const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || !shippingAddress || !totalPrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get Razorpay client
    const razorpay = getRazorpayClient();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user.id,
        email: req.user.email,
      },
    });

    // Create order document in DB
    const order = new Order({
      orderItems,
      user: req.user.id,
      shippingAddress,
      totalPrice,
      paymentMethod: 'razorpay',
      razorpayDetails: {
        orderId: razorpayOrder.id,
      },
      isPaid: false,
    });

    await order.save();

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Get Razorpay key secret for verification
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: 'Razorpay not configured' });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if payment was already verified to prevent duplicate stock decrements
    if (order.isPaid) {
      return res.json({
        message: 'Payment already verified',
        order,
      });
    }

    // Decrement stock for each product in the order
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      
      // Update stock for the specific size
      const sizeIndex = product.sizes.findIndex(s => String(s.size) === String(item.size));
      if (sizeIndex !== -1) {
        if (product.sizes[sizeIndex].stock < item.qty) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name} size ${item.size}` 
          });
        }
        product.sizes[sizeIndex].stock -= item.qty;
        product.countInStock -= item.qty;
        await product.save();
      } else {
        // If size not found but product has countInStock, decrement it
        if (product.countInStock >= item.qty) {
          product.countInStock -= item.qty;
          await product.save();
        } else {
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name}` 
          });
        }
      }
    }

    // Update order as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.razorpayDetails.paymentId = razorpayPaymentId;
    order.razorpayDetails.signature = razorpaySignature;
    await order.save();

    res.json({
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Verify products exist and update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      
      // Update stock for the specific size
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      if (sizeIndex !== -1) {
        if (product.sizes[sizeIndex].stock < item.qty) {
          return res.status(400).json({ 
            message: `Insufficient stock for size ${item.size}` 
          });
        }
        product.sizes[sizeIndex].stock -= item.qty;
        product.countInStock -= item.qty;
        await product.save();
      }
    }

    const order = new Order({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) {
      // Check if user owns the order or is admin
      if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(401).json({ message: "Not authorized" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      
      // Automatically mark as paid when delivered
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

