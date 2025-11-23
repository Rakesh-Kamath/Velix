import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shareToken, setShareToken] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleMoveToCart = (product, size) => {
    const availableSize = product.sizes.find((s) => s.stock > 0);
    if (availableSize) {
      addToCart(product, availableSize.size, 1);
      alert("Added to cart!");
    } else {
      alert("This product is out of stock");
    }
  };

  const handleShareWishlist = async () => {
    try {
      const res = await api.post("/wishlist/share");
      setShareToken(res.data.token);
      setShareUrl(`${window.location.origin}/wishlist/shared/${res.data.token}`);
      navigator.clipboard.writeText(
        `${window.location.origin}/wishlist/shared/${res.data.token}`
      );
      alert("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Error generating share link");
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 text-xl">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">My Wishlist</h1>
          <button
            onClick={handleShareWishlist}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity font-medium shadow-lg"
          >
            Share Wishlist
          </button>
        </div>

        {shareUrl && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
            <p className="text-sm font-semibold mb-2 text-green-800 dark:text-green-200">✓ Share link copied to clipboard!</p>
            <p className="text-sm text-green-700 dark:text-green-300 break-all font-mono">
              {shareUrl}
            </p>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-2xl font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start adding products you love!</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => {
                const availableSize = product.sizes.find((s) => s.stock > 0);
                return (
                  <div
                    key={product._id}
                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="block no-underline text-inherit"
                    >
                      <div className="relative w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.rating > 0 && (
                          <div className="absolute top-3 right-3 bg-white dark:bg-black px-2 py-1 rounded-lg shadow-md flex items-center gap-1 text-sm font-semibold">
                            <span className="text-yellow-400">★</span>
                            <span>{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                    <div className="px-4 pb-4 flex gap-2">
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-500 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-500 transition-all font-medium"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleMoveToCart(product, availableSize?.size)}
                        disabled={!availableSize}
                        className="flex-1 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

