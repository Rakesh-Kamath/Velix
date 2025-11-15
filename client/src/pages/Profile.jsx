import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
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

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Account Information</h2>
        <p className="text-lg mb-2">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        {loading ? (
          <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-8 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6">
                <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        order.isPaid
                          ? "bg-white dark:bg-black border-black dark:border-white"
                          : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    {order.isDelivered && (
                      <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-white dark:bg-black border border-black dark:border-white">
                        Delivered
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-4 mb-6">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600 dark:text-gray-400">Size: {item.size} × {item.qty}</p>
                      </div>
                      <p className="font-bold">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
                  <strong className="text-xl">Total: ${order.totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

