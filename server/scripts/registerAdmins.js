import User from "../models/User.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const registerAdmins = async () => {
  try {
    await connectDB();
    
    const adminUsers = [
      { name: "Rakesh Kamath", email: "rakesh@velix.in" },
      { name: "Prajwal Prakash", email: "prajwal@velix.in" },
      { name: "Aditya Prakash", email: "aditya@velix.in" }
    ];
    
    const password = "velix@123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    for (const userData of adminUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists. Updating role to admin.`);
        existingUser.role = "admin";
        await existingUser.save();
      } else {
        // Create new admin user
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: "admin"
        });
        
        await newUser.save();
        console.log(`✅ Created admin user: ${userData.name} (${userData.email})`);
      }
    }
    
    console.log("✅ All admin users registered/updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error registering admin users:", error);
    process.exit(1);
  }
};

registerAdmins();