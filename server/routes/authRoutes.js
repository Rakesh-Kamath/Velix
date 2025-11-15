import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// --- REGISTER ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password is required and must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// --- GOOGLE AUTHENTICATION ---
router.post("/google", async (req, res) => {
  try {
    // Ensure server has GOOGLE_CLIENT_ID configured at request time
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.warn('Google auth attempted but GOOGLE_CLIENT_ID missing in environment');
      return res.status(503).json({
        message: "Google authentication is not configured. Please set GOOGLE_CLIENT_ID in your .env file.",
      });
    }

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Create a client for this request (ensures any .env updates are picked up)
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with this email (for users who registered with email first)
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.avatar = picture;
        if (!user.name) user.name = name;
        await user.save();
      } else {
        // Create new user
        user = new User({
          name,
          email,
          googleId,
          avatar: picture,
          password: "", // No password for Google users
        });
        await user.save();
      }
    } else {
      // Update avatar if changed
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Google authentication successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
});

// --- PROFILE (Protected) ---
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
