# Velix Sneakers - MERN E-commerce Platform

A full-stack, production-ready sneakers e-commerce website built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features

- 🛍️ **Product Catalog**: Browse sneakers by category with search functionality
- 🛒 **Shopping Cart**: Add items to cart with size selection and quantity management
- 💳 **Checkout System**: Complete order placement with shipping address and payment method
- 👤 **User Authentication**: Register, login, and user profile management
- 📦 **Order Management**: View order history and order details
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔒 **Secure**: JWT-based authentication and protected routes

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React** with React Router
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
```

4. Seed the database with sample products (optional):
```bash
node data/seedProducts.js
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Important:** For Google Authentication setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application" as the application type
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production URL (for production)
7. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production URL (for production)
8. Copy the **Client ID** (not the Client Secret)
9. Add it to both `.env` files:
   - Server: `GOOGLE_CLIENT_ID=your_client_id_here`
   - Client: `VITE_GOOGLE_CLIENT_ID=your_client_id_here`
10. **Restart your development servers** after adding environment variables

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173` (or another port if 5173 is busy)

## Project Structure

```
Velix/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── data/
│   │   └── seedProducts.js    # Seed data script
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── adminMiddleware.js # Admin authorization
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   └── server.js              # Express server
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axios.js        # Axios configuration
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── OrderSuccess.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Profile.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── tailwind.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (with optional query params: keyword, category)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/myorders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/pay` - Update order to paid (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)

## Usage

1. **Browse Products**: Visit the home page to see all available sneakers
2. **Search & Filter**: Use the search bar and category filters to find specific products
3. **View Product Details**: Click on any product to see details, select size, and add to cart
4. **Shopping Cart**: View and manage items in your cart
5. **Checkout**: Complete your order with shipping information
6. **View Orders**: Check your order history in the profile page

## Admin Features

To create an admin user, update the user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Admin users can:
- Create, update, and delete products
- View all orders
- Mark orders as delivered

## Production Deployment

### Backend
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend
1. Build the production bundle:
```bash
npm run build
```
2. Deploy the `dist` folder to platforms like Vercel, Netlify, or AWS S3

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

