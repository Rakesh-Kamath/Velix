import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, sizePurchased, trueToSize } = req.body;
    const userId = req.user._id;

    // Check if user has purchased this product
    const order = await Order.findOne({
      user: userId,
      "orderItems.product": productId,
      isPaid: true,
    });

    if (!order) {
      return res.status(400).json({
        message: "You can only review products you have purchased",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
      sizePurchased,
      trueToSize,
    });

    const createdReview = await review.save();

    // Update product rating
    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / reviews.length;
    product.numReviews = reviews.length;
    await product.save();

    // Populate user info
    await createdReview.populate("user", "name");

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = "newest" } = req.query;

    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "helpful":
        sortOption = { helpfulCount: -1 };
        break;
      case "rating-high":
        sortOption = { rating: -1 };
        break;
      case "rating-low":
        sortOption = { rating: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort(sortOption);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    const userId = req.user._id;

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isAlreadyHelpful = review.helpfulUsers.includes(userId);

    if (isAlreadyHelpful) {
      // Remove helpful vote
      review.helpfulUsers = review.helpfulUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add helpful vote
      review.helpfulUsers.push(userId);
      review.helpfulCount += 1;
    }

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { rating, comment, sizePurchased, trueToSize } = req.body;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.sizePurchased = sizePurchased || review.sizePurchased;
    review.trueToSize = trueToSize || review.trueToSize;

    const updatedReview = await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / reviews.length;
    await product.save();

    await updatedReview.populate("user", "name");
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const productId = review.product;
    await Review.deleteOne({ _id: review._id });

    // Update product rating
    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = totalRating / reviews.length;
      product.numReviews = reviews.length;
    } else {
      product.rating = 0;
      product.numReviews = 0;
    }
    await product.save();

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

