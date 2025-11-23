import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sizePurchased, setSizePurchased] = useState("");
  const [trueToSize, setTrueToSize] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-8">
        <p className="text-gray-600 dark:text-gray-400">
          Please login to leave a review. You can only review products you have purchased.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a review comment");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        productId,
        rating,
        comment,
        sizePurchased: sizePurchased ? Number(sizePurchased) : undefined,
        trueToSize: trueToSize || undefined,
      });
      setRating(0);
      setComment("");
      setSizePurchased("");
      setTrueToSize("");
      alert("Review submitted successfully!");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        error.response?.data?.message ||
          "Error submitting review. Make sure you have purchased this product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-8 mb-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">WRITE A REVIEW</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Share your experience with other shoppers</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-3 font-semibold text-sm">RATING *</label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-all transform hover:scale-110 ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-700"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-3 font-semibold text-sm">SIZE PURCHASED</label>
          <input
            type="text"
            value={sizePurchased}
            onChange={(e) => setSizePurchased(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
          />
        </div>

        {sizePurchased && (
          <div>
            <label className="block mb-3 font-semibold text-sm">TRUE TO SIZE?</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTrueToSize("runs small")}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  trueToSize === "runs small"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                Runs Small
              </button>
              <button
                type="button"
                onClick={() => setTrueToSize("true to size")}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  trueToSize === "true to size"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                True to Size
              </button>
              <button
                type="button"
                onClick={() => setTrueToSize("runs large")}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  trueToSize === "runs large"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                Runs Large
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block mb-3 font-semibold text-sm">YOUR REVIEW *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows="6"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {comment.length}/500 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Submitting...
            </span>
          ) : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

