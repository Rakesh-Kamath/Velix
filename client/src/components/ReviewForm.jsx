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
          Please login to leave a review. You can only review products you have
          purchased.
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
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Size Purchased</label>
          <input
            type="number"
            value={sizePurchased}
            onChange={(e) => setSizePurchased(e.target.value)}
            placeholder="e.g., 10"
            min="1"
            max="20"
            step="0.5"
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
          />
        </div>

        {sizePurchased && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">True to Size?</label>
            <select
              value={trueToSize}
              onChange={(e) => setTrueToSize(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
            >
              <option value="">Select...</option>
              <option value="runs small">Runs Small</option>
              <option value="true to size">True to Size</option>
              <option value="runs large">Runs Large</option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium">Your Review *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows="5"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

