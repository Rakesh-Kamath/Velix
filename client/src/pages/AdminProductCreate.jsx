import { useEffect } from 'react';
import ProductForm from '../components/admin/ProductForm';

export default function AdminProductCreate() {
  useEffect(() => {
    document.title = 'Add New Product - Admin Dashboard';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductForm />
    </div>
  );
}