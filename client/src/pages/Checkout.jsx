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
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });
  const [paypalEmail, setPaypalEmail] = useState("");

  const subtotal = getCartTotal();
  const shipping = 0;
  const tax = subtotal * 0.18;
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

        // Check if Razorpay key is configured
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey || razorpayKey === 'your_razorpay_key_id_here') {
          alert('Razorpay is not configured. Please set VITE_RAZORPAY_KEY_ID in .env file.');
          setLoadingRazorpay(false);
          return;
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onerror = () => {
          alert('Failed to load Razorpay. Please check your internet connection.');
          setLoadingRazorpay(false);
        };
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
            modal: {
              ondismiss: () => {
                setLoadingRazorpay(false);
                alert('Payment cancelled');
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            setLoadingRazorpay(false);
            alert('Payment failed: ' + response.error.description);
          });
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

    // Handle Credit Card payment
    if (paymentMethod === "card") {
      // Validate card details
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.nameOnCard) {
        alert("Please fill in all credit card details");
        return;
      }
      
      // Basic card number validation (should be 13-19 digits)
      const cardNumber = cardDetails.cardNumber.replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(cardNumber)) {
        alert("Please enter a valid card number");
        return;
      }
      
      // Validate expiry date (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        alert("Please enter expiry date in MM/YY format");
        return;
      }
      
      // Validate CVV (3-4 digits)
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        alert("Please enter a valid CVV");
        return;
      }
      
      // In a real application, you would process the card payment through a payment gateway here
      // For now, we'll create the order with payment info (but not actually charge the card)
      alert("Credit Card payment processing is not fully integrated. Please use Razorpay for secure payments.");
      return;
    }

    // Handle PayPal payment
    if (paymentMethod === "paypal") {
      // Validate PayPal email
      if (!paypalEmail) {
        alert("Please enter your PayPal email address");
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(paypalEmail)) {
        alert("Please enter a valid email address");
        return;
      }
      
      // In a real application, you would redirect to PayPal or process through PayPal API here
      alert("PayPal payment processing is not fully integrated. Please use Razorpay for secure payments.");
      return;
    }

    // Handle Cash on Delivery (no payment info needed upfront)
    if (paymentMethod === "cash") {
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
      return;
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
            <div className="space-y-3 mb-6">
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

            {/* Credit Card Payment Details */}
            {paymentMethod === "card" && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Credit Card Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.nameOnCard}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, nameOnCard: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, "");
                        if (value.length <= 16) {
                          value = value.match(/.{1,4}/g)?.join(" ") || value;
                          setCardDetails({ ...cardDetails, cardNumber: value });
                        }
                      }}
                      maxLength={19}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 4) {
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + "/" + value.slice(2);
                            }
                            setCardDetails({ ...cardDetails, expiryDate: value });
                          }
                        }}
                        maxLength={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setCardDetails({ ...cardDetails, cvv: value });
                        }}
                        maxLength={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Payment Details */}
            {paymentMethod === "paypal" && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">PayPal Details</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">PayPal Email Address</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    You will be redirected to PayPal to complete your payment
                  </p>
                </div>
              </div>
            )}

            {/* Cash on Delivery Info */}
            {paymentMethod === "cash" && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment will be collected when your order is delivered. No payment information is required at this time.
                </p>
              </div>
            )}
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
                  <p className="font-bold">₹{(item.product.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shipping.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-300 dark:border-gray-700">
                <span>Total:</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

