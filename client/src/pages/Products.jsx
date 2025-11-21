import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const priceDropdownRef = useRef(null);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || (searchParam ? '' : 'footwear');
  const saleParam = searchParams.get('sale') === 'true';
  const [category, setCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [showSaleOnly, setShowSaleOnly] = useState(saleParam);
  
  // Common filters
  const [brand, setBrand] = useState('');
  const [gender, setGender] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('');
  
  // Footwear specific
  const [shoeSize, setShoeSize] = useState('');
  const [subcategory, setSubcategory] = useState('');
  
  // Accessories specific
  const [productType, setProductType] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category, brand, gender, priceRange, sortBy, shoeSize, subcategory, productType, showSaleOnly, searchQuery]);

  useEffect(() => {
    setCategory(categoryParam);
    setShowSaleOnly(saleParam);
    setSearchQuery(searchParam);
    // Reset category-specific filters when category changes
    setShoeSize('');
    setSubcategory('');
    setProductType('');
  }, [categoryParam, saleParam, searchParam]);

  // Close price dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setShowPriceDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [priceDropdownRef]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('keyword', searchQuery);
      if (category && !showSaleOnly) params.append('category', category);
      if (showSaleOnly) params.append('sale', 'true');
      if (brand) params.append('brand', brand);
      if (gender) params.append('gender', gender);
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0]);
      if (priceRange[1] < 50000) params.append('maxPrice', priceRange[1]);
      if (sortBy) params.append('sort', sortBy);
      
      // Footwear specific
      if (category === 'footwear') {
        if (shoeSize) params.append('size', shoeSize);
        if (subcategory) params.append('subcategory', subcategory);
      }
      
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
    setPriceRange([0, 50000]);
    setSortBy('');
    setShoeSize('');
    setSubcategory('');
    setProductType('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : showSaleOnly ? 'Sale Items' : category === 'footwear' ? 'FOOTWEAR FOR MEN AND WOMEN' : category === 'accessories' ? 'ACCESSORIES FOR MEN AND WOMEN' : 'All Products'}
      </h1>

      {/* Filters & Sort */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        {/* Left Side - Filters */}
        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
          {/* Footwear Filters - Size */}
          {category === 'footwear' && !showSaleOnly && (
            <div className="relative min-w-[120px]">
              <select
                value={shoeSize}
                onChange={(e) => setShoeSize(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
              >
                <option value="">Size</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Footwear Filters - Style (Subcategory) */}
          {category === 'footwear' && !showSaleOnly && (
            <div className="relative min-w-[120px]">
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
              >
                <option value="">Type</option>
                <option value="running">Running</option>
                <option value="basketball">Basketball</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="skateboarding">Skateboarding</option>
                <option value="training">Training</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Accessories Filters - Type */}
          {category === 'accessories' && !showSaleOnly && (
            <div className="relative min-w-[120px]">
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
              >
                <option value="">Type</option>
                <option value="socks">Socks</option>
                <option value="bags">Bags</option>
                <option value="caps">Caps</option>
                <option value="laces">Laces</option>
                <option value="insoles">Insoles</option>
                <option value="cleaner">Cleaning Kits</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Brand Filter */}
          <div className="relative min-w-[120px]">
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
            >
              <option value="">Brand</option>
              {category === 'accessories' ? (
                <>
                  <option value="Adidas">Adidas</option>
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Gender Filter */}
          <div className="relative min-w-[120px]">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
            >
              <option value="">Gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Price Filters */}
          <div className="relative" ref={priceDropdownRef}>
            <button
              onClick={() => setShowPriceDropdown(!showPriceDropdown)}
              className="w-full lg:w-32 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white flex justify-between items-center"
            >
              <span>Price</span>
              <svg className={`w-4 h-4 transition-transform ${showPriceDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showPriceDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl z-50 p-4">
                <div className="mb-4">
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    {/* Range Track */}
                    <div 
                      className="absolute h-full bg-black dark:bg-white rounded-full"
                      style={{
                        left: `${(priceRange[0] / 50000) * 100}%`,
                        right: `${100 - (priceRange[1] / 50000) * 100}%`
                      }}
                    />
                    {/* Min Thumb */}
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), priceRange[1] - 1000);
                        setPriceRange([val, priceRange[1]]);
                      }}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    {/* Max Thumb */}
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), priceRange[0] + 1000);
                        setPriceRange([priceRange[0], val]);
                      }}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPriceDropdown(false)}
                    className="text-xs font-bold bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded"
                  >
                    APPLY
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-black dark:hover:text-white underline ml-2"
          >
            Clear All
          </button>
        </div>

        {/* Right Side - Sort By */}
        <div className="w-full lg:w-auto min-w-[150px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
          >
            <option value="">Sort By</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="popularity">Most Popular</option>
          </select>
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
