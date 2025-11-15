import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ReviewList({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reviews/product/${productId}`, {
        params: { sort: sortBy },
      });
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!user) {
      alert("Please login to mark reviews as helpful");
      return;
    }
    try {
      const res = await api.put(`/reviews/${reviewId}/helpful`);
      setReviews(
        reviews.map((r) => (r._id === reviewId ? res.data : r))
      );
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
        </select>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      {review.user?.name || "Anonymous"}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.trueToSize && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Size {review.sizePurchased} - {review.trueToSize}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>
              <button
                onClick={() => handleHelpful(review._id)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-2"
              >
                <span>👍</span>
                <span>Helpful ({review.helpfulCount})</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

