import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useComparison } from "../context/ComparisonContext";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Footer from "../components/Footer";

export default function Home() {
  const { addToComparison } = useComparison();
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const searchRef = useRef(null);
  const newArrivalScrollRef = useRef(null);
  const trendingScrollRef = useRef(null);

  const heroSlides = [
    {
      title: "New Arrivals",
      subtitle: "Latest Premium Sneakers Collection",
      description: "Discover the newest additions to our exclusive lineup",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=600&fit=crop",
      cta: "Shop New Arrivals",
      link: "/products?category=footwear",
    },
    {
      title: "Summer Sale",
      subtitle: "Up to 40% Off Selected Items",
      description: "Limited time offer on premium sneakers",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=600&fit=crop",
      cta: "Shop Sale",
      link: "/products?sale=true",
    },
    {
      title: "Exclusive Drops",
      subtitle: "Limited Edition Releases",
      description: "Get your hands on rare and exclusive designs",
      image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=1200&h=600&fit=crop",
      cta: "Explore Exclusives",
      link: "/products?subcategory=lifestyle",
    },
  ];

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchNewArrivals();
    fetchTrending();
  }, [category, searchKeyword, brand, minPrice, maxPrice, size, sort]);

  // Refetch new arrivals when tab changes
  useEffect(() => {
    fetchNewArrivals();
  }, [newArrivalTab]);

  // Refetch trending when tab changes
  useEffect(() => {
    fetchTrending();
  }, [trendingTab]);

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

  // Auto-slide hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

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
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const params = { sort: "newest", limit: 10 };
      if (newArrivalTab === "footwear") {
        params.category = "footwear";
      } else if (newArrivalTab === "accessories") {
        params.category = "accessories";
      }
      const res = await api.get("/products", { params });
      setNewArrivals(res.data.products || res.data);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    }
  };

  const fetchTrending = async () => {
    try {
      const params = { sort: "popularity", limit: 10 };
      if (trendingTab === "men") {
        params.gender = "men";
      } else if (trendingTab === "women") {
        params.gender = "women";
      }
      const res = await api.get("/products", { params });
      setTrending(res.data.products || res.data);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div>
      {/* Hero Carousel */}
      <div className="relative w-full h-[500px] overflow-hidden mb-12">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
              <div className="max-w-3xl">
                <h1 className="text-6xl font-bold mb-4 animate-fadeIn">{slide.title}</h1>
                <p className="text-3xl opacity-90 mb-2">{slide.subtitle}</p>
                <p className="text-xl opacity-80 mb-8">{slide.description}</p>
                <Link
                  to={slide.link}
                  className="px-8 py-4 bg-white text-black rounded-lg text-lg font-bold hover:opacity-90 transition-opacity inline-block"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-sm transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-sm transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={() => setNewArrivalTab("accessories")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  newArrivalTab === "accessories"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                ACCESSORIES
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={newArrivalScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64">
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : (
                newArrivals.map((product) => (
                  <div key={product._id} className="flex-shrink-0 w-64">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
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
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64">
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : (
                trending.map((product) => (
                  <div key={product._id} className="flex-shrink-0 w-64">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
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
