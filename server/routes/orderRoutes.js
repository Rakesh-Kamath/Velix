import express from "express";
import { body } from "express-validator"; // <--- Import validator
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import validateRequest from "../middleware/validateRequest.js"; // <--- Import middleware

const router = express.Router();

router.route("/").post(
  protect, 
  [
    body("orderItems").isArray().withMessage("Order items must be an array"),
    body("orderItems.*.name").trim().escape(), // Sanitize each item name
    body("shippingAddress.address").trim().escape(),
    body("shippingAddress.city").trim().escape(),
    body("shippingAddress.postalCode").trim().escape(),
    body("shippingAddress.country").trim().escape(),
    body("paymentMethod").trim().escape(),
  ],
  validateRequest,
  addOrderItems
).get(protect, admin, getOrders);

router.route("/myorders").get(protect, getMyOrders);
router.route("/razorpay/create").post(protect, createRazorpayOrder);
router.route("/razorpay/verify").post(protect, verifyRazorpayPayment);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;