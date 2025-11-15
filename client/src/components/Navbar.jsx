import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useWishlist } from "../context/WishlistContext";
import { useComparison } from "../context/ComparisonContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { comparisonProducts } = useComparison();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700 py-4 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          👟 Velix Sneakers
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="font-medium hover:opacity-80 transition-opacity">
            Home
          </Link>
          <Link to="/products" className="font-medium hover:opacity-80 transition-opacity">
            Products
          </Link>
          <Link to="/comparison" className="font-medium hover:opacity-80 transition-opacity relative">
            Compare
            {comparisonProducts.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {comparisonProducts.length}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/wishlist" className="font-medium hover:opacity-80 transition-opacity relative">
                Wishlist
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="font-medium hover:opacity-80 transition-opacity">
                Cart ({getCartItemsCount()})
              </Link>
              <Link to="/profile" className="font-medium hover:opacity-80 transition-opacity flex items-center gap-2">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-medium hover:opacity-80 transition-opacity">
                Login
              </Link>
              <Link to="/register" className="font-medium hover:opacity-80 transition-opacity">
                Register
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

