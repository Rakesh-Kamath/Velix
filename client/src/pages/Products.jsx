import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      <img 
        src={product.images[0]} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
        <h3 className="font-semibold text-sm md:text-base truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-3">
          <p className="font-bold text-lg">₹{product.price}</p>
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
            ⭐ {product.rating}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    keyword: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.category) params.append('category', filters.category);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const brands = ['Heritage', 'ZoomLabs', 'SummitGear', 'UrbanMove', 'HoopsPro', 'EasyWear'];
  const categories = ['running', 'casual', 'hiking', 'street', 'basketball'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Sneakers</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search sneakers..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={() => setFilters({ category: '', brand: '', keyword: '' })}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
