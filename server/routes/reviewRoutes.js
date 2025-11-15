import express from "express";
import {
  createReview,
  getProductReviews,
  markReviewHelpful,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createReview);
router.route("/product/:productId").get(getProductReviews);
router.route("/:id/helpful").put(protect, markReviewHelpful);
router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

export default router;

