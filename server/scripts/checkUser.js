import User from "../models/User.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const checkUser = async (email) => {
  try {
    await connectDB();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }
    
    console.log(`User found:`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  ID: ${user._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking user:", error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2] || 'velixadmin@velix.in';

checkUser(email);