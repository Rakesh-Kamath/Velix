import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { body } from "express-validator"; 
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

// Helper to get admin emails from ENV
const getAdminEmails = () => {
  return process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
};

// --- REGISTER ---
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required").escape(),
    body("email").isEmail().withMessage("Must be a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // SECURE: Check against environment variable list instead of hardcoded array
      const adminEmails = getAdminEmails();
      const role = adminEmails.includes(email) ? 'admin' : 'user';

      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// --- LOGIN ---
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Must be a valid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      
      // SECURE: Check for master admin using Environment Variables
      const masterEmail = process.env.MASTER_ADMIN_EMAIL;
      const masterPassword = process.env.MASTER_ADMIN_PASSWORD;
      
      const isAdminCredentials = 
        masterEmail && 
        masterPassword && 
        email === masterEmail && 
        password === masterPassword;

      console.log('Login attempt:', { email, isAdminCredentials, isMatch });
      
      if (!isMatch && !isAdminCredentials)
        return res.status(400).json({ message: "Invalid email or password" });

      // If using special admin credentials, temporarily set role to admin
      let userRole = user.role;
      if (isAdminCredentials) {
        userRole = 'admin';
        console.log('Granting admin privileges to:', email);
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: userRole },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// --- GOOGLE AUTHENTICATION ---
router.post("/google", async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.warn('Google auth attempted but GOOGLE_CLIENT_ID missing');
      return res.status(503).json({
        message: "Google authentication is not configured.",
      });
    }

    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Google token is required" });

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });
      
      if (user) {
        user.googleId = googleId;
        user.avatar = picture;
        if (!user.name) user.name = name;
        await user.save();
      } else {
        // SECURE: Check against environment variable list
        const adminEmails = getAdminEmails();
        const role = adminEmails.includes(email) ? 'admin' : 'user';
        
        user = new User({
          name,
          email,
          googleId,
          avatar: picture,
          password: "", 
          role,
        });
        await user.save();
      }
    } else {
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    }

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
        role: user.role,
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;