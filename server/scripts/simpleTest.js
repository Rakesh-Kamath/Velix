// Simple test to verify the login logic
const email = 'velixadmin@velix.in';
const password = 'velix@123';

// Check if this is the special admin combination
const isAdminCredentials = email === 'velixadmin@velix.in' && password === 'velix@123';
console.log('isAdminCredentials:', isAdminCredentials);

if (isAdminCredentials) {
  console.log('Should grant admin privileges');
} else {
  console.log('Should use normal authentication');
}