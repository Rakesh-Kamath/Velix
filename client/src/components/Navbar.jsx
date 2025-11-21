import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const { data } = await api.get(`/products?keyword=${encodeURIComponent(searchQuery)}&limit=5`);
          setSearchResults(data.products || []);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="bg-transparent dark:bg-transparent border-b border-gray-300/30 dark:border-gray-700/30 py-2 sm:py-4 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="w-full px-3 sm:px-6 md:px-12 flex justify-between items-center relative">
        {/* Logo - Far Left */}
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity z-10">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tighter relative">
            VELIX
            <span className="absolute -top-1 -right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></span>
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-base font-semibold text-white hover:text-gray-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            NEW ARRIVAL
          </Link>
          <Link to="/products?category=footwear" className="text-base font-semibold text-white hover:text-gray-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            FOOTWEAR
          </Link>
          <Link to="/products?category=accessories" className="text-base font-semibold text-white hover:text-gray-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            ACCESSORIES
          </Link>
          <Link to="/products?sale=true" className="text-base font-semibold text-white hover:text-gray-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            SALES
          </Link>
        </div>

        {/* Right Icons - Far Right */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 z-10">
          {/* Search Icon */}
          <div ref={searchRef} className={`relative flex items-center transition-all duration-300 ${showSearch ? 'w-64' : 'w-10'}`}>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center ${showSearch ? 'w-full' : 'w-10 justify-center'}`}>
              {showSearch ? (
                <div className="w-full relative">
                  <form onSubmit={handleSearch} className="w-full relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-4 pr-10 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-900 border-none focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowSearch(false);
                        setSearchResults([]);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </form>

                  {/* Live Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-none transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <img 
                              src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {product.brand}
                            </p>
                          </div>
                          <div className="ml-2 text-sm font-semibold text-black dark:text-white">
                            ₹{product.price}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        View all results
                      </button>
                    </div>
                  )}
                  
                  {isSearching && searchResults.length === 0 && searchQuery.trim().length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 text-center z-50">
                       <div className="w-5 h-5 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto"></div>
                     </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors relative"
            aria-label="Wishlist"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Profile Icon */}
          {user ? (
            <div className="relative group">
              <Link
                to="/profile"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors flex items-center"
                aria-label="Profile"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </Link>
              {/* Dropdown menu on hover */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-t-lg"
                >
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Login"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors relative"
            aria-label="Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

