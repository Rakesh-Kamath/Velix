import User from "../models/User.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    await connectDB();
    
    // Check if the admin user already exists
    const existingUser = await User.findOne({ email: 'velixadmin@velix.in' });
    
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create the admin user with the specific password
    const hashedPassword = await bcrypt.hash('velix@123', 10);
    const newUser = new User({
      name: 'Velix Admin',
      email: 'velixadmin@velix.in',
      password: hashedPassword,
      role: 'user' // Default role, will be elevated during login
    });
    
    await newUser.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: velixadmin@velix.in');
    console.log('Password: velix@123');
    console.log('Note: This user will get admin privileges only during login with these exact credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();