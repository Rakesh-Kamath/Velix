# Velix - Modern E-commerce Platform

A full-stack, production-ready footwear and accessories e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## 🌟 Features

### Customer Features
- 🛍️ **Product Catalog**: Browse footwear and accessories with advanced search and filtering
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🛒 **Shopping Cart**: Add items with size selection and quantity management
- ❤️ **Wishlist**: Save favorite products for later
- 💳 **Checkout System**: Complete order placement with Razorpay integration
- 👤 **User Authentication**: Register, login (including Google OAuth)
- 📦 **Order Management**: View order history with real-time status tracking
- ⭐ **Product Reviews**: Rate and review purchased products
- 🔍 **Advanced Search**: Search products by name, brand, category, and price range
- 🏷️ **Brand Collections**: Browse products by popular brands (Nike, Adidas, Puma, etc.)
- 📱 **Mobile Responsive**: Optimized for all devices
- 🌙 **Dark Mode**: Full dark theme support

### Admin Features
- 📊 **Admin Dashboard**: Complete store management interface
- 📦 **Product Management**: Create, update, and delete products
- 🎯 **Order Management**: View and update order status
- 👥 **User Management**: View and manage users
- 📈 **Analytics**: Track sales and order statistics
- ✅ **Auto-Payment Marking**: Orders automatically marked as paid when delivered (COD support)

## 🚀 Tech Stack

### Backend
- **Node.js** v14+ with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Google OAuth 2.0** for social login
- **express-mongo-sanitize** for security
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with React Router v6
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **Axios** for API calls
- **Context API** for state management (Auth, Cart, Wishlist)
- **React Hot Toast** for notifications
- **Razorpay** for payment integration

### Key Libraries
- **Frontend**: react-router-dom, axios, react-hot-toast
- **Backend**: express, mongoose, jsonwebtoken, cors, dotenv

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

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
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

### Mobile Testing Setup

To test on your mobile device on the same WiFi network:

1. Find your computer's local IP address (e.g., `192.168.0.103`)

2. Update the client `.env` file:
```env
VITE_API_URL=http://192.168.0.103:5000/api
```

3. The server is configured to listen on all network interfaces (`0.0.0.0`)

4. Access the site from your phone using: `http://192.168.0.103:5173`

**Note:** Both devices must be on the same WiFi network.

## 🔑 Third-Party Service Setup

### Google OAuth Configuration

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
9. Add it to both `.env` files as shown above
10. **Restart your development servers** after adding environment variables

### Razorpay Integration

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your Test API Key from the Dashboard
3. Add `VITE_RAZORPAY_KEY_ID` to the client `.env` file
4. For production, use Live API keys

## 📁 Project Structure

```
Velix/
├── server/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── productController.js     # Product CRUD operations
│   │   ├── orderController.js       # Order management
│   │   ├── reviewController.js      # Review system
│   │   ├── wishlistController.js    # Wishlist management
│   │   └── chatController.js        # Chat/messaging
│   ├── data/
│   │   └── seedProducts.js          # Database seeding script
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT authentication
│   │   └── adminMiddleware.js       # Admin authorization
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Product.js               # Product schema
│   │   ├── Order.js                 # Order schema
│   │   ├── Review.js                # Review schema
│   │   └── Wishlist.js              # Wishlist schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── productRoutes.js         # Product endpoints
│   │   ├── orderRoutes.js           # Order endpoints
│   │   ├── reviewRoutes.js          # Review endpoints
│   │   ├── wishlistRoutes.js        # Wishlist endpoints
│   │   └── chatRoutes.js            # Chat endpoints
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express server entry point
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axios.js              # Axios configuration
    │   ├── components/
    │   │   ├── Navbar.jsx            # Navigation bar
    │   │   ├── Footer.jsx            # Footer component
    │   │   ├── ProductCard.jsx       # Product display card
    │   │   ├── ReviewList.jsx        # Product reviews
    │   │   └── admin/                # Admin components
    │   │       ├── ProductForm.jsx   # Product create/edit form
    │   │       └── ProductList.jsx   # Admin product list
    │   ├── context/
    │   │   ├── AuthContext.jsx       # Authentication state
    │   │   ├── CartContext.jsx       # Shopping cart state
    │   │   └── WishlistContext.jsx   # Wishlist state
    │   ├── pages/
    │   │   ├── Home.jsx              # Home page
    │   │   ├── Products.jsx          # Products listing
    │   │   ├── ProductDetail.jsx     # Single product page
    │   │   ├── Cart.jsx              # Shopping cart
    │   │   ├── Checkout.jsx          # Checkout page
    │   │   ├── OrderSuccess.jsx      # Order confirmation
    │   │   ├── Login.jsx             # Login page
    │   │   ├── Register.jsx          # Registration page
    │   │   ├── Profile.jsx           # User profile & orders
    │   │   ├── Wishlist.jsx          # Wishlist page
    │   │   ├── Brands.jsx            # Brand collections
    │   │   ├── ContactUs.jsx         # Contact information
    │   │   ├── FAQ.jsx               # Frequently asked questions
    │   │   ├── HelpCenter.jsx        # Help center
    │   │   └── admin/                # Admin pages
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProductCreate.jsx
    │   │       └── AdminProductEdit.jsx
    │   ├── App.jsx                   # Main app component
    │   ├── main.jsx                  # React entry point
    │   └── index.css                 # Global styles
    ├── .env                          # Environment variables
    ├── tailwind.config.js            # Tailwind configuration
    ├── vite.config.js                # Vite configuration
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user (email/password)
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products
  - Query params: `keyword`, `category`, `brand`, `minPrice`, `maxPrice`, `size`, `sort`, `gender`
- `GET /api/products/:id` - Get single product
- `GET /api/products/brands` - Get all brands
- `GET /api/products/search/suggestions` - Get search suggestions
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
  - Automatically marks order as paid when delivered (COD support)

### Reviews
- `POST /api/reviews/:productId` - Create product review (protected, purchase required)
- `GET /api/reviews/:productId` - Get product reviews
- `PUT /api/reviews/:reviewId` - Update review (protected, owner only)
- `DELETE /api/reviews/:reviewId` - Delete review (protected, owner only)
- `POST /api/reviews/:reviewId/helpful` - Mark review as helpful (protected)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (protected)
- `POST /api/wishlist/:productId` - Add product to wishlist (protected)
- `DELETE /api/wishlist/:productId` - Remove product from wishlist (protected)

### Chat
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/messages` - Get chat messages (admin only)

## 🎯 Usage

### Customer Workflow
1. **Browse Products**: Visit the home page to see new arrivals, trending items, and all products
2. **Search & Filter**: Use search, category filters, brand filters, price range, and sorting
3. **View Product Details**: Click on any product to see details, images, reviews, and ratings
4. **Size Selection**: Choose size and add to cart or wishlist
5. **Shopping Cart**: View and manage items, adjust quantities, select sizes
6. **Checkout**: Enter shipping information and complete payment via Razorpay
7. **Order Tracking**: View order history and status in your profile
8. **Reviews**: Rate and review products you've purchased
9. **Wishlist**: Save products for later and easily add to cart

### Admin Workflow
1. **Login**: Access admin dashboard (user role must be set to 'admin')
2. **Product Management**:
   - Create new products with images, pricing, sizes, and inventory
   - Update existing products
   - Delete products
   - View product statistics
3. **Order Management**:
   - View all customer orders
   - Update order status
   - Mark orders as delivered (automatically marks as paid for COD)
4. **User Management**: View and manage registered users

## 👨‍💼 Admin Setup

To create an admin user, update the user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@nmamit.in" },
  { $set: { role: "admin" } }
)
```

Or using MongoDB Compass:
1. Open the `users` collection
2. Find your user document
3. Edit the document and set `role: "admin"`
4. Save changes

Admin users can access the admin dashboard at `/admin` and have full control over:
- Product catalog (create, read, update, delete)
- Order management (view all orders, update status)
- User management (view users)

## 🛍️ Supported Brands

### Footwear Brands
- Nike
- Adidas
- Puma
- Reebok
- Converse
- Asics
- New Balance

### Accessory Brands
- Adidas
- Nike
- Happy Socks
- Gaston Luga
- FDMTL
- MM6 (Maison Margiela)

## 📱 Mobile Optimization

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized carousel scrolling
- Mobile-first product cards
- Responsive navigation
- Smooth scroll behavior for iOS
- Properly sized tap targets

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Variables**: Set the following in your hosting platform:
```env
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=production
```

2. **Build Steps**:
```bash
npm install --production
```

3. **Start Command**:
```bash
node server.js
```

4. **Recommended Platforms**:
   - Railway
   - Render
   - Heroku
   - AWS EC2/Elastic Beanstalk
   - DigitalOcean App Platform

### Frontend Deployment

1. **Update Environment Variables**:
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_live_key
```

2. **Build Production Bundle**:
```bash
npm run build
```

3. **Deploy the `dist` folder to**:
   - Vercel (recommended)
   - Netlify
   - AWS S3 + CloudFront
   - Firebase Hosting

4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node Version: 18.x or higher

### Post-Deployment Checklist

- [ ] Update Google OAuth authorized origins with production URL
- [ ] Update Razorpay webhook URLs
- [ ] Configure CORS settings for production domain
- [ ] Set up SSL certificates (HTTPS)
- [ ] Configure CDN for static assets
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Test payment gateway in live mode
- [ ] Update contact information and addresses

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Code Formatting
```bash
# Format code with Prettier
npm run format
```

### Linting
```bash
# Check for linting errors
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

**Products not showing on mobile:**
- Ensure phone and computer are on the same WiFi network
- Update `VITE_API_URL` to use computer's local IP (e.g., `http://192.168.0.103:5000/api`)
- Restart both frontend and backend servers
- Check firewall settings allow connections on ports 5000 and 5173

**Google OAuth not working:**
- Verify `GOOGLE_CLIENT_ID` is set in both client and server `.env` files
- Check authorized origins include your current URL
- Restart servers after updating environment variables

**Razorpay payment failing:**
- Confirm `VITE_RAZORPAY_KEY_ID` is set correctly
- Use test mode keys for development
- Check browser console for errors

**Database connection issues:**
- Verify MongoDB is running (local) or accessible (Atlas)
- Check `MONGO_URI` format is correct
- Ensure IP whitelist includes your IP (Atlas)

## 📞 Contact Information

For support or inquiries:
- Email: nnm23cb004@nmamit.in, nnm23cb013@nmamit.in, nnm23cb038@nmamit.in
- Address: NMAM Institute of Technology, Nitte, Karkala Taluk, Udupi District, Karnataka 574110, India

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with MERN stack
- Styled with Tailwind CSS
- Icons from Heroicons
- Payment integration by Razorpay
- Authentication via Google OAuth

---

**Made with ❤️ by the Velix Team**