import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  generateShareToken,
  getSharedWishlist,
} from "../controllers/wishlistController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getWishlist);
router.route("/share").post(protect, generateShareToken);
router.route("/shared/:token").get(getSharedWishlist);
router
  .route("/:productId")
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

export default router;

