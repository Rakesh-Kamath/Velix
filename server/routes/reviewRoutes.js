import express from "express";
import { body } from "express-validator"; // <--- Import validator
import {
  createReview,
  getProductReviews,
  markReviewHelpful,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js"; // <--- Import custom middleware

const router = express.Router();

router.route("/").post(
  protect, 
  [
    body("rating").isNumeric().withMessage("Rating must be a number"),
    // Escape comment to prevent XSS
    body("comment").trim().escape(), 
    body("sizePurchased").optional().trim().escape(),
    body("trueToSize").optional().trim().escape(),
  ],
  validateRequest,
  createReview
);

router.route("/product/:productId").get(getProductReviews);

router.route("/:id/helpful").put(protect, markReviewHelpful);

router.route("/:id")
  .put(
    protect, 
    [
      body("rating").optional().isNumeric(),
      body("comment").optional().trim().escape(),
      body("sizePurchased").optional().trim().escape(),
      body("trueToSize").optional().trim().escape(),
    ],
    validateRequest,
    updateReview
  )
  .delete(protect, deleteReview);

export default router;