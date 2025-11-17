import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
          <p className="font-bold text-lg">${product.price}</p>
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
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const categoryParam = searchParams.get('category') || 'footwear';
  const [category, setCategory] = useState(categoryParam);
  
  // Common filters
  const [brand, setBrand] = useState('');
  const [gender, setGender] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  // Footwear specific
  const [shoeSize, setShoeSize] = useState('');
  
  // Accessories specific
  const [productType, setProductType] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category, brand, gender, minPrice, maxPrice, sortBy, shoeSize, productType]);

  useEffect(() => {
    setCategory(categoryParam);
    // Reset category-specific filters when category changes
    setShoeSize('');
    setProductType('');
  }, [categoryParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (gender) params.append('gender', gender);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sort', sortBy);
      
      // Footwear specific
      if (category === 'footwear' && shoeSize) params.append('size', shoeSize);
      
      // Accessories specific
      if (category === 'accessories' && productType) params.append('productType', productType);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setBrand('');
    setGender('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setShoeSize('');
    setProductType('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {category === 'footwear' ? 'Footwear' : 'Accessories'}
      </h1>

      {/* Category Toggle */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setCategory('footwear')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            category === 'footwear'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          FOOTWEAR
        </button>
        <button
          onClick={() => setCategory('accessories')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            category === 'accessories'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          ACCESSORIES
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Footwear Filters */}
          {category === 'footwear' && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium">Shoe Size</label>
                <select
                  value={shoeSize}
                  onChange={(e) => setShoeSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sizes</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
            </>
          )}

          {/* Accessories Filters */}
          {category === 'accessories' && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium">Product Type</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="socks">Socks</option>
                  <option value="bags">Bags</option>
                  <option value="caps">Caps</option>
                  <option value="laces">Laces</option>
                  <option value="insoles">Insoles</option>
                  <option value="cleaner">Cleaning Kits</option>
                </select>
              </div>
            </>
          )}

          {/* Common Filters */}
          <div>
            <label className="block mb-2 text-sm font-medium">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="Puma">Puma</option>
              <option value="New Balance">New Balance</option>
              <option value="Vans">Vans</option>
              <option value="Reebok">Reebok</option>
              <option value="Crep Protect">Crep Protect</option>
              <option value="Dr. Scholl's">Dr. Scholl's</option>
              <option value="Lace Lab">Lace Lab</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
              <option value="kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Sort By Price</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Min Price ($)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Max Price ($)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="mt-4 px-6 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-300 transition"
        >
          Clear All Filters
        </button>
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
