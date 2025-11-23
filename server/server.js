// --- Import Dependencies ---
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

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

// --- Security Fix for Express 5 ---
// This allows express-mongo-sanitize to modify req.query
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: req.query,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  next();
});

// --- Mount Sanitization Middleware ---
app.use(mongoSanitize());

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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Mobile access: http://192.168.0.103:${PORT}`);
});