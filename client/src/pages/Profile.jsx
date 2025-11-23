import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import Footer from "../components/Footer";

export default function Profile() {
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setProfileData({
      name: user.name || "",
      email: user.email || "",
    });
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/myorders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format price - handles legacy USD data by converting if value is small
  const formatPrice = (price) => {
    // Heuristic: If price is less than 600, it's likely USD (since cheapest INR item is 669)
    // Convert USD to INR (approx 85)
    const value = price < 600 ? price * 85 : price;
    return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMoveToCart = (product) => {
    const availableSize = product.sizes.find((s) => s.stock > 0);
    if (availableSize) {
      addToCart(product, availableSize.size, 1);
      alert("Added to cart!");
    } else {
      alert("This product is out of stock");
    }
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const pendingOrders = orders.filter(order => !order.isDelivered).length;
    const completedOrders = orders.filter(order => order.isDelivered).length;
    
    return { totalOrders, totalSpent, pendingOrders, completedOrders };
  };

  const stats = getOrderStats();

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your profile and view your orders</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <div className="relative">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-200 dark:border-gray-700">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-black"></div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full">
                    Administrator
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-center"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalOrders}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Orders</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{formatPrice(stats.totalSpent)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingOrders}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.completedOrders}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-4 mb-6 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === "orders"
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Order History
              {activeTab === "orders" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === "wishlist"
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Wishlist
              {activeTab === "wishlist" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
              )}
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              {loading ? (
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Loading your orders...</p>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <svg className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to see your orders here</p>
                    <Link
                      to="/products"
                      className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Order Header */}
                      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-300 dark:border-gray-700">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-6">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-500 uppercase mb-1">Order ID</p>
                              <p className="font-mono text-sm font-medium">#{order._id.slice(-8)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-500 uppercase mb-1">Date</p>
                              <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-500 uppercase mb-1">Total</p>
                              <p className="text-sm font-bold">₹{formatPrice(order.totalPrice)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {order.isDelivered ? (
                              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                ✓ Delivered & Paid
                              </span>
                            ) : (
                              <span
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                                  order.isPaid
                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                    : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                }`}
                              >
                                {order.isPaid ? "✓ Paid" : "Pending Payment"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                              <Link to={`/product/${item.product}`}>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700 hover:opacity-75 transition-opacity cursor-pointer"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link 
                                  to={`/product/${item.product}`}
                                  className="font-semibold mb-1 truncate hover:underline block"
                                >
                                  {item.name}
                                </Link>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  <span>Size: {item.size}</span>
                                  <span>•</span>
                                  <span>Qty: {item.qty}</span>
                                  <span>•</span>
                                  <span>₹{formatPrice(item.price)} each</span>
                                </div>
                              </div>
                              <p className="font-bold text-lg">₹{formatPrice(item.price * item.qty)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700 flex justify-between items-center">
                          <Link
                            to={`/order/${order._id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            View Details →
                          </Link>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Total</p>
                            <p className="text-2xl font-bold">₹{formatPrice(order.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div>
              {wishlistLoading ? (
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
                  </div>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <svg className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Start adding products you love!</p>
                    <Link
                      to="/products"
                      className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => {
                      const availableSize = product.sizes.find((s) => s.stock > 0);
                      return (
                        <div
                          key={product._id}
                          className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                        >
                          <Link
                            to={`/product/${product._id}`}
                            className="block no-underline text-inherit"
                          >
                            <div className="relative w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.rating > 0 && (
                                <div className="absolute top-3 right-3 bg-white dark:bg-black px-2 py-1 rounded-lg shadow-md flex items-center gap-1 text-sm font-semibold">
                                  <span className="text-yellow-400">★</span>
                                  <span>{product.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">
                                {product.brand}
                              </p>
                              <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                                {product.name}
                              </h3>
                              <p className="text-2xl font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                            </div>
                          </Link>
                          <div className="px-4 pb-4 flex gap-2">
                            <button
                              onClick={() => removeFromWishlist(product._id)}
                              className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-500 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-500 transition-all font-medium"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => handleMoveToCart(product)}
                              disabled={!availableSize}
                              className="flex-1 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

