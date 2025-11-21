// --- Import Dependencies ---
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// --- Import Local Files ---
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"

// --- Initialize App ---
dotenv.config();
connectDB();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // allows parsing of JSON requests

// --- Mount Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRoutes);

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
