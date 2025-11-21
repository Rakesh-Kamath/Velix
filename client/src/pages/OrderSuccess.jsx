import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format price - handles legacy USD data by converting if value is small
  const formatPrice = (price) => {
    const value = price < 600 ? price * 85 : price;
    return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  if (loading) {
    return <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-4xl font-bold mb-8">Order not found</h1>
        <Link
          to="/"
          className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-5xl text-white dark:text-black">✓</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Order ID: {order._id}</p>
      </div>

      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Order Details</h2>
        <div className="space-y-4 mb-8">
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600 dark:text-gray-400">Size: {item.size} × {item.qty}</p>
              </div>
              <p className="font-bold text-lg">₹{formatPrice(item.price * item.qty)}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Shipping Address</h3>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{formatPrice(order.itemsPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{formatPrice(order.shippingPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{formatPrice(order.taxPrice)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-300 dark:border-gray-700">
            <span>Total:</span>
            <span>₹{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

