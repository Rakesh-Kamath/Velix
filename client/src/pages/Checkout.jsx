import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      name: item.product.name,
      qty: item.qty,
      image: item.product.image,
      price: item.product.price,
      product: item.product._id,
      size: item.size,
    }));

    // Handle Razorpay payment
    if (paymentMethod === "razorpay") {
      setLoadingRazorpay(true);
      try {
        const { data } = await api.post('/orders/razorpay/create', {
          orderItems,
          shippingAddress,
          totalPrice: total,
        });

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            order_id: data.razorpayOrderId,
            name: 'Velix Sneakers',
            description: 'Order for sneakers',
            image: 'https://via.placeholder.com/150',
            handler: async (response) => {
              try {
                // Verify payment on backend
                await api.post('/orders/razorpay/verify', {
                  orderId: data.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });

                clearCart();
                navigate(`/order/${data.orderId}`);
              } catch (error) {
                alert('Payment verification failed: ' + error.response?.data?.message);
              }
            },
            prefill: {
              name: user?.name || '',
              email: user?.email || '',
              contact: '',
            },
            theme: {
              color: '#000000',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.head.appendChild(script);
      } catch (error) {
        alert('Checkout failed: ' + error.response?.data?.message);
      } finally {
        setLoadingRazorpay(false);
      }
      return;
    }

    // Handle other payment methods (existing code)
    try {
      const order = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const res = await api.post("/orders", order);
      clearCart();
      navigate(`/order/${res.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error placing order");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-16 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, address: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, country: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-lg">Razorpay (UPI, Card, Wallet)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-lg">Credit Card</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-lg">PayPal</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-lg">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingRazorpay}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg text-xl font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loadingRazorpay ? 'Processing...' : 'Place Order'}
          </button>
        </form>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Size: {item.size} × {item.qty}</p>
                  </div>
                  <p className="font-bold">${(item.product.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-300 dark:border-gray-700">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

