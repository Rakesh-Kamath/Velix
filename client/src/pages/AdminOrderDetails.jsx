import { useEffect } from 'react';
import OrderDetails from '../components/admin/OrderDetails';

export default function AdminOrderDetails() {
  useEffect(() => {
    document.title = 'Order Details - Admin Dashboard';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <OrderDetails />
    </div>
  );
}