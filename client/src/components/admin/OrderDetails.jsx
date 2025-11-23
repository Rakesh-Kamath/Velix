import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async () => {
    if (window.confirm('Are you sure you want to mark this order as delivered?')) {
      try {
        await api.put(`/orders/${id}/deliver`);
        toast.success('Order marked as delivered successfully');
        fetchOrder(); // Refresh the order data
      } catch (err) {
        toast.error('Failed to update order status: ' + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium text-sm">Back to Dashboard</span>
        </button>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Order Details</h2>
          {!order.isDelivered && (
            <button
              onClick={markAsDelivered}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Order Information</h3>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm break-all">{order._id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.isDelivered 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {order.isDelivered ? 'Delivered' : 'Processing'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Payment Information</h3>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.isPaid 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-medium">{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact</h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-medium">{order.user?.name}</p>
              <p>{order.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">Order Items</h3>
        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="flex-shrink-0 w-20 h-20">
                <img
                  src={item.image || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Size: {item.size} • Quantity: {item.qty}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ₹{(item.price * item.qty)?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">₹{item.price?.toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t-2 border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Total:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}