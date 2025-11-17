import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: function() { return [this.image]; }
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["footwear", "accessories"],
    },
    subcategory: {
      type: String,
      enum: ["running", "basketball", "lifestyle", "skateboarding", "training", "socks", "bags", "caps", "laces", "insoles", "cleaner"],
    },
    gender: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      default: "unisex",
    },
    productType: {
      type: String,
      enum: ["socks", "bags", "caps", "laces", "insoles", "cleaner", "other"],
    },
    sizes: [
      {
        size: { type: mongoose.Schema.Types.Mixed, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    color: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

