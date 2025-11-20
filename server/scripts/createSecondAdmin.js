import User from "../models/User.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createSecondAdmin = async () => {
  try {
    await connectDB();
    
    const adminEmail = 'admin2@velix.in';
    const adminPassword = 'admin123';
    
    // Check if the admin user already exists
    let existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log('Second admin user exists, updating role to admin...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('✅ Admin role updated successfully');
    } else {
      // Create the second admin user with admin role
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newUser = new User({
        name: 'Admin 2',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      await newUser.save();
      console.log('✅ Second admin user created successfully');
    }
    
    console.log('\n=== Second Admin Credentials ===');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating second admin user:', error);
    process.exit(1);
  }
};

createSecondAdmin();
