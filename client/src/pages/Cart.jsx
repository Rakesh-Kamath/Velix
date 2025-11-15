import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQty,
    getCartTotal,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-16 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={`${item.product._id}-${item.size}-${index}`}
              className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold mb-1">{item.product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">Size: {item.size}</p>
                <p className="text-lg font-bold mt-2">${item.product.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-colors"
                  onClick={() => updateCartItemQty(item.product._id, item.size, item.qty - 1)}
                >
                  -
                </button>
                <span className="text-lg font-medium w-8 text-center">{item.qty}</span>
                <button
                  className="w-10 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-colors"
                  onClick={() => updateCartItemQty(item.product._id, item.size, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <div className="text-xl font-bold">
                ${(item.product.price * item.qty).toFixed(2)}
              </div>
              <button
                className="text-2xl hover:opacity-70 transition-opacity"
                onClick={() => removeFromCart(item.product._id, item.size)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
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
            <button
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold hover:opacity-80 transition-opacity mb-3"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
            <button
              className="w-full border border-gray-300 dark:border-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

