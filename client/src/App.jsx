import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import SharedWishlist from "./pages/SharedWishlist";
import Comparison from "./pages/Comparison";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <ComparisonProvider>
            <CartProvider>
              <Router>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order/:id" element={<OrderSuccess />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/wishlist/shared/:token" element={<SharedWishlist />} />
                  <Route path="/comparison" element={<Comparison />} />
                </Routes>
              </Router>
            </CartProvider>
          </ComparisonProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
