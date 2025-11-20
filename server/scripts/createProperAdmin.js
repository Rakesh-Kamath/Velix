import User from "../models/User.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createProperAdmin = async () => {
  try {
    await connectDB();
    
    const adminEmail = 'admin@velix.in';
    const adminPassword = 'admin123';
    
    // Check if the admin user already exists
    let existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log('Admin user exists, updating role to admin...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('✅ Admin role updated successfully');
    } else {
      // Create the admin user with admin role
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin' // Set role to admin directly
      });
      
      await newUser.save();
      console.log('✅ Admin user created successfully');
    }
    
    console.log('\n=== Admin Credentials ===');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('========================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createProperAdmin();
