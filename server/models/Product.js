import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      default: null,
    },
    isOnSale: {
      type: Boolean,
      default: false,
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
    aboutProduct: {
      type: String,
      default: "",
    },
    productDetails: {
      type: String,
      default: "",
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

// Database Indexes for Performance
// Compound index for common filter combinations
productSchema.index({ category: 1, brand: 1, price: 1, gender: 1 });

// Individual indexes for frequently queried fields
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ isOnSale: 1 });

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Index for sorting by rating and reviews
productSchema.index({ rating: -1 });
productSchema.index({ numReviews: -1 });

// Index for stock availability
productSchema.index({ countInStock: 1 });

export default mongoose.model("Product", productSchema);

