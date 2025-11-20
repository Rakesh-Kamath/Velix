import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const categoryParam = searchParams.get('category') || 'footwear';
  const saleParam = searchParams.get('sale') === 'true';
  const [category, setCategory] = useState(categoryParam);
  const [showSaleOnly, setShowSaleOnly] = useState(saleParam);
  
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
  }, [category, brand, gender, minPrice, maxPrice, sortBy, shoeSize, productType, showSaleOnly]);

  useEffect(() => {
    setCategory(categoryParam);
    setShowSaleOnly(saleParam);
    // Reset category-specific filters when category changes
    setShoeSize('');
    setProductType('');
  }, [categoryParam, saleParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && !showSaleOnly) params.append('category', category);
      if (showSaleOnly) params.append('sale', 'true');
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
        {showSaleOnly ? 'Sale Items' : category === 'footwear' ? 'Footwear' : 'Accessories'}
      </h1>

      {/* Category Toggle - Hide when showing sale items */}
      {!showSaleOnly && (
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
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Filters</h2>
          <button
            onClick={clearFilters}
            className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Clear All
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Footwear Filters */}
          {category === 'footwear' && !showSaleOnly && (
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Shoe Size</label>
              <select
                value={shoeSize}
                onChange={(e) => setShoeSize(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          )}

          {/* Accessories Filters */}
          {category === 'accessories' && !showSaleOnly && (
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Product Type</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          )}

          {/* Common Filters */}
          <div className="flex-1 min-w-[150px]">
            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              {category === 'accessories' ? (
                <>
                  <option value="adidas">adidas</option>
                  <option value="FDMTL">FDMTL</option>
                  <option value="Gaston Luga">Gaston Luga</option>
                  <option value="Happy Socks">Happy Socks</option>
                  <option value="MM6">MM6</option>
                  <option value="Nike">Nike</option>
                </>
              ) : (
                <>
                  <option value="Nike">Nike</option>
                  <option value="Puma">Puma</option>
                  <option value="Reebok">Reebok</option>
                  <option value="Converse">Converse</option>
                  <option value="Asics">Asics</option>
                  <option value="New Balance">New Balance</option>
                </>
              )}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
              <option value="kids">Kids</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Min Price (₹)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Max Price (₹)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="20000"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
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
            <ProductCard key={product._id} product={product} showAddToCart={true} />
          ))}
        </div>
      )}
    </div>
  );
}
