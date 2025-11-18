import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '../components/admin/ProductForm';

export default function AdminProductEdit() {
  const { id } = useParams();

  useEffect(() => {
    document.title = 'Edit Product - Admin Dashboard';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductForm />
    </div>
  );
}