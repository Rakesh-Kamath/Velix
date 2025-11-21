import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import SizeGuide from "../components/SizeGuide";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAboutProduct, setShowAboutProduct] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(-1);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchAllProducts();
  }, [id]);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (!product || product.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [product]);

  const fetchAllProducts = async () => {
    try {
      const res = await api.get("/products");
      const products = res.data.products || res.data || [];
      setAllProducts(products);
      const index = products.findIndex(p => p._id === id);
      setCurrentProductIndex(index);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const goToNextProduct = () => {
    if (currentProductIndex >= 0 && currentProductIndex < allProducts.length - 1) {
      const nextProduct = allProducts[currentProductIndex + 1];
      navigate(`/product/${nextProduct._id}`);
    }
  };

  const goToPreviousProduct = () => {
    if (currentProductIndex > 0) {
      const prevProduct = allProducts[currentProductIndex - 1];
      navigate(`/product/${prevProduct._id}`);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const data = res.data;

      // Normalize images: support `images` array or single `image` field
      const images = data.images && data.images.length ? data.images : data.image ? [data.image] : [];

      // Normalize sizes to array of { size: string, stock: number }
      const normalizeSizes = (sizes, fallbackStock = data.countInStock || 0) => {
        if (!sizes) return [];
        return sizes
          .map((s) => {
            if (s == null) return null;
            if (typeof s === 'string' || typeof s === 'number') {
              return { size: String(s), stock: Number(fallbackStock || 0) };
            }
            if (s.size !== undefined) {
              return { size: String(s.size), stock: Number(s.stock ?? fallbackStock ?? 0) };
            }
            // Malformed object like { '0': '8', stock: 0 }
            const keys = Object.keys(s);
            let sizeVal = null;
            for (const k of keys) {
              const v = s[k];
              if (typeof v === 'number' || (typeof v === 'string' && /^\d+(?:\.\d+)?$/.test(v))) {
                sizeVal = v;
                break;
              }
            }
            const stockVal = s.stock ?? s.count ?? fallbackStock;
            return { size: sizeVal != null ? String(sizeVal) : '', stock: Number(stockVal ?? 0) };
          })
          .filter(Boolean);
      };

      const normSizes = normalizeSizes(data.sizes);
      const productObj = { ...data, images, sizes: normSizes };
      setProduct(productObj);

      if (productObj.sizes && productObj.sizes.length > 0) {
        const availableSize = productObj.sizes.find((s) => Number(s.stock) > 0);
        if (availableSize) setSelectedSize(availableSize.size);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // For products with sizes, size must be selected
    if (allSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    // For accessories without sizes, use 'One Size' as default
    const sizeToAdd = allSizes.length > 0 ? selectedSize : 'One Size';
    addToCart(product, sizeToAdd, qty);
    toast.success(`Added ${qty} item(s) to cart!`);
  };

  if (loading) {
    return <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12 text-xl">Product not found</div>;
  }

  const allSizes = product.sizes || [];
  const images = product.images || [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        className="bg-black dark:bg-white text-white dark:text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg mb-8 hover:opacity-80 transition-opacity"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-lg">
        {/* Image Gallery */}
        <div>
          <div className="relative w-full h-96 lg:h-[500px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 mb-4">
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            />
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all"
                  title="Previous Image"
                >
                  ←
                </button>
                <button
                  onClick={() => setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all"
                  title="Next Image"
                >
                  →
                </button>
              </>
            )}
          </div>
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-full h-20 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? 'border-black dark:border-white'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-1 uppercase tracking-wide font-bold">{product.brand}</p>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base mb-4">{product.color}</p>
          {product.rating > 0 && (
            <div className="text-lg mb-4">
              ⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </div>
          )}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold">₹{product.isOnSale && product.salePrice ? product.salePrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}</p>
              {product.isOnSale && product.salePrice && (
                <>
                  <p className="text-2xl text-gray-500 dark:text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</p>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <button
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to add items to wishlist");
                  navigate("/login");
                  return;
                }
                // Check current state BEFORE toggle
                const wasInWishlist = isInWishlist(product._id);
                const success = await toggleWishlist(product._id);
                if (success) {
                  if (wasInWishlist) {
                    toast.success("Removed from wishlist");
                  } else {
                    toast.success("Added to wishlist");
                  }
                } else {
                  toast.error("Failed to update wishlist. Please try again.");
                }
              }}
              className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                isInWishlist(product._id)
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
              }`}
            >
              {isInWishlist(product._id) ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
            </button>

          </div>

          <div className="mb-4">
            <button
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showSizeGuide ? "Hide" : "Show"} Size Guide
            </button>
          </div>

          {showSizeGuide && <SizeGuide />}

          {allSizes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Select Size:</h3>
              <div className="flex gap-2 flex-wrap">
                {allSizes.map((sizeObj) => {
                  const isAvailable = sizeObj.stock > 0;
                  const isSelected = selectedSize === sizeObj.size;
                  return (
                    <button
                      key={sizeObj.size}
                      onClick={() => isAvailable && setSelectedSize(sizeObj.size)}
                      disabled={!isAvailable}
                      className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : isAvailable
                          ? 'bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                          : 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {sizeObj.size}
                      {!isAvailable && (
                        <span className="block text-xs mt-1">Out of stock</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(allSizes.length === 0 || allSizes.some(s => s.stock > 0)) && (
            <div className="mb-8">
              <label className="block mb-2 font-medium">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-colors text-xl"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  -
                </button>
                <span className="text-xl font-medium w-8 text-center">{qty}</span>
                <button
                  className="w-10 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-colors text-xl"
                  onClick={() =>
                    setQty(
                      Math.min(
                        qty + 1,
                        allSizes.find((s) => s.size === selectedSize)?.stock || 1
                      )
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xl font-bold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={(allSizes.length > 0 && !selectedSize) || (allSizes.length > 0 && !allSizes.some(s => s.stock > 0)) || (allSizes.length === 0 && product.countInStock === 0)}
          >
            {(allSizes.length > 0 && allSizes.some(s => s.stock > 0)) || (allSizes.length === 0 && product.countInStock > 0) ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* About Product Dropdown */}
          {product.aboutProduct && (
            <div className="mt-8 border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setShowAboutProduct(!showAboutProduct)}
                className="w-full py-4 flex justify-between items-center hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-semibold">About Product</span>
                {showAboutProduct ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showAboutProduct ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{product.aboutProduct}</p>
              </div>
            </div>
          )}

          {/* Product Details Dropdown */}
          {product.productDetails && (
            <div className="mt-4 border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setShowProductDetails(!showProductDetails)}
                className="w-full py-4 flex justify-between items-center hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-semibold">Product Details</span>
                {showProductDetails ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showProductDetails ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{product.productDetails}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoomed Image Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:opacity-70 transition-opacity"
            title="Close"
          >
            ×
          </button>
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className="max-w-full max-h-[95vh] object-contain cursor-zoom-out"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 sm:p-4 rounded-full transition-all text-2xl"
                  title="Previous Image"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 sm:p-4 rounded-full transition-all text-2xl"
                  title="Next Image"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-12">
        <ReviewForm productId={id} onReviewSubmitted={() => window.location.reload()} />
        <ReviewList productId={id} />
      </div>
    </div>
  );
}

