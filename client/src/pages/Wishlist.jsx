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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Wishlist</h1>
        <button
          onClick={handleShareWishlist}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
        >
          Share Wishlist
        </button>
      </div>

      {shareUrl && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <p className="text-sm mb-2">Share this link:</p>
          <p className="text-blue-600 dark:text-blue-400 break-all">
            {shareUrl}
          </p>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Your wishlist is empty
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((product) => {
            const availableSize = product.sizes.find((s) => s.stock > 0);
            return (
              <div
                key={product._id}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="block no-underline text-inherit"
                >
                  <div className="w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {product.brand}
                    </p>
                    <p className="text-2xl font-bold mb-2">₹{product.price.toLocaleString('en-IN')}</p>
                    {product.rating > 0 && (
                      <div className="text-sm mb-2">
                        ⭐ {product.rating.toFixed(1)} ({product.numReviews})
                      </div>
                    )}
                  </div>
                </Link>
                <div className="px-6 pb-6 flex gap-2">
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-500 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleMoveToCart(product, availableSize?.size)}
                    disabled={!availableSize}
                    className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

