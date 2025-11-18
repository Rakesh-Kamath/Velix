import User from "../models/User.js";
import Product from "../models/Product.js";
import crypto from "crypto";

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    const { productId } = req.params;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    const product = await Product.findById(productId);
    res.json({ message: "Product added to wishlist", product });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    const { productId } = req.params;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Generate share token for wishlist
// @route   POST /api/wishlist/share
// @access  Private
export const generateShareToken = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.wishlistShareToken = token;
    await user.save();

    res.json({ token, shareUrl: `/wishlist/shared/${token}` });
  } catch (error) {
    console.error('Generate share token error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get shared wishlist by token
// @route   GET /api/wishlist/shared/:token
// @access  Public
export const getSharedWishlist = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ wishlistShareToken: token }).populate(
      "wishlist"
    );

    if (!user) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.json({
      userName: user.name,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

