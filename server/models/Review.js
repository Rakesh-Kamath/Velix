import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sizePurchased: {
      type: Number,
    },
    trueToSize: {
      type: String,
      enum: ["runs small", "true to size", "runs large"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from same user for same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);

