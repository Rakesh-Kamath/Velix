import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const testLogin = async () => {
  try {
    console.log('Testing login with special admin credentials...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'velixadmin@velix.in',
      password: 'velix@123'
    });
    
    console.log('Login response:');
    console.log('  Status:', response.status);
    console.log('  User role:', response.data.user.role);
    console.log('  Full user data:', response.data.user);
    
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    } else {
      console.error('  Error:', error.message);
    }
  }
};

testLogin();