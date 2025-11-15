import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Password optional for Google OAuth users
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user", // or "admin"
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    wishlistShareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
