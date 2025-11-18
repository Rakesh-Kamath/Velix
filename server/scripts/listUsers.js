import User from "../models/User.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const listUsers = async () => {
  try {
    await connectDB();
    
    const users = await User.find({}, 'name email role');
    
    console.log("Users in the database:");
    console.log("=====================");
    users.forEach(user => {
      console.log(`${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error listing users:", error);
    process.exit(1);
  }
};

listUsers();