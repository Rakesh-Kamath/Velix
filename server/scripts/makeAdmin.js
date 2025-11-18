import User from "../models/User.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await connectDB();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }
    
    user.role = "admin";
    await user.save();
    
    console.log(`✅ User ${user.name} (${user.email}) is now an admin`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error making user admin:", error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log("Usage: node scripts/makeAdmin.js <email>");
  process.exit(1);
}

makeAdmin(email);