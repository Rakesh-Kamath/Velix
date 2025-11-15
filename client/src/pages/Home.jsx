import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useComparison } from "../context/ComparisonContext";
import { useWishlist } from "../context/WishlistContext";
import Footer from "../components/Footer";

export default function Home() {
  const { addToComparison } = useComparison();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("newest");
  const [brands, setBrands] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newArrivalTab, setNewArrivalTab] = useState("footwear");
  const [trendingTab, setTrendingTab] = useState("men");
  const searchRef = useRef(null);
  const newArrivalScrollRef = useRef(null);
  const trendingScrollRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchNewArrivals();
    fetchTrending();
  }, [category, searchKeyword, brand, minPrice, maxPrice, size, sort]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchKeyword.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchKeyword]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (searchKeyword) params.keyword = searchKeyword;
      if (brand) params.brand = brand;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (size) params.size = size;
      if (sort) params.sort = sort;

      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const res = await api.get("/products", { params: { sort: "newest", limit: 10 } });
      setNewArrivals(res.data);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await api.get("/products", { params: { sort: "popularity", limit: 10 } });
      setTrending(res.data);
    } catch (error) {
      console.error("Error fetching trending:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/products/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/products/search/suggestions", {
        params: { q: searchKeyword },
      });
      setSuggestions(res.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchKeyword(suggestion);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSize("");
    setSearchKeyword("");
    setSort("newest");
  };

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const ProductCard = ({ product, showWishlist = true }) => (
    <div className="flex-shrink-0 w-64 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 relative group">
      <Link to={`/product/${product._id}`} className="no-underline text-inherit block">
        <div className="w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Vendor:</span>
            <span className="text-xs font-medium">{product.brand}</span>
            {showWishlist && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product._id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                {isInWishlist(product._id) ? "❤️" : "🤍"}
              </button>
            )}
          </div>
          <h3 className="text-lg font-bold mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.color}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Regular price</span>
            <span className="text-lg font-bold">${product.price}</span>
          </div>
          {product.rating > 0 && (
            <div className="text-xs mt-2">
              ⭐ {product.rating.toFixed(1)} ({product.numReviews})
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full h-[500px] bg-gradient-to-r from-black to-gray-900 text-white flex items-center justify-center mb-12">
        <div className="text-center z-10">
          <h1 className="text-6xl font-bold mb-4">Premium Sneakers Collection</h1>
          <p className="text-2xl opacity-90 mb-8">Step into style with our curated selection</p>
          <Link
            to="#products"
            className="px-8 py-4 bg-white text-black rounded-lg text-lg font-bold hover:opacity-90 transition-opacity inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative mb-4" ref={searchRef}>
            <input
              type="text"
              placeholder="Search sneakers..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-colors"
          >
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
                >
                  <option value="">All Categories</option>
                  <option value="running">Running</option>
                  <option value="basketball">Basketball</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="skateboarding">Skateboarding</option>
                  <option value="training">Training</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
                >
                  <option value="">All Sizes</option>
                  {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* New Arrivals Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">NEW ARRIVAL</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setNewArrivalTab("footwear")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  newArrivalTab === "footwear"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                FOOTWEAR
              </button>
              <button
                onClick={() => setNewArrivalTab("apparel")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  newArrivalTab === "apparel"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                APPAREL
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={newArrivalScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <button
              onClick={() => scrollCarousel(newArrivalScrollRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              ←
            </button>
            <button
              onClick={() => scrollCarousel(newArrivalScrollRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              →
            </button>
          </div>
        </section>

        {/* Brand Logos Section */}
        {brands.length > 0 && (
          <section className="mb-16">
            <div className="flex justify-center gap-8 flex-wrap">
              {brands.slice(0, 6).map((brandName) => (
                <Link
                  key={brandName}
                  to={`/?brand=${brandName}`}
                  className="text-2xl font-bold hover:opacity-70 transition-opacity"
                >
                  {brandName.toUpperCase()}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">TRENDING</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTrendingTab("men")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  trendingTab === "men"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                MEN
              </button>
              <button
                onClick={() => setTrendingTab("women")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  trendingTab === "women"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                WOMEN
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={trendingScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {trending.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <button
              onClick={() => scrollCarousel(trendingScrollRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              ←
            </button>
            <button
              onClick={() => scrollCarousel(trendingScrollRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              →
            </button>
          </div>
        </section>

        {/* All Products Section */}
        <section id="products" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">ALL PRODUCTS</h2>
          {loading ? (
            <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-400">
              Loading...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-xl text-gray-600 dark:text-gray-400">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
