import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function SharedWishlist() {
  const { token } = useParams();
  const [wishlistData, setWishlistData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedWishlist();
  }, [token]);

  const fetchSharedWishlist = async () => {
    try {
      const res = await api.get(`/wishlist/shared/${token}`);
      setWishlistData(res.data);
    } catch (error) {
      console.error("Error fetching shared wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 text-xl">Loading...</div>
      </div>
    );
  }

  if (!wishlistData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Wishlist not found or has been removed
          </p>
          <Link
            to="/"
            className="mt-4 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity inline-block"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-2">
        {wishlistData.userName}'s Wishlist
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {wishlistData.wishlist.length} item(s)
      </p>

      {wishlistData.wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            This wishlist is empty
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistData.wishlist.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 no-underline text-inherit block"
            >
              <div className="w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {product.brand}
                </p>
                <p className="text-2xl font-bold mb-2">${product.price}</p>
                {product.rating > 0 && (
                  <div className="text-sm">
                    ⭐ {product.rating.toFixed(1)} ({product.numReviews})
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

