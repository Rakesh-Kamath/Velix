import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProductCard({ product, showWishlist = true, showAddToCart = true }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1) {
      // Show second image immediately on hover if available
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const hasSizes = product?.sizes && product.sizes.length > 0;
    const availableSize = hasSizes ? product.sizes.find((s) => Number(s.stock) > 0) : null;
    const canAdd = hasSizes 
      ? (availableSize && Number(availableSize.stock) > 0)
      : product.countInStock > 0;

    if (!canAdd) {
      toast.error('Out of stock');
      return;
    }

    const sizeToUse = availableSize ? availableSize.size : 'One Size';
    addToCart(product, sizeToUse, 1);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    
    // Check current state BEFORE toggle
    const wasInWishlist = isInWishlist(product._id);
    const success = await toggleWishlist(product._id);
    
    if (success) {
      if (wasInWishlist) {
        toast.success('Removed from wishlist');
      } else {
        toast.success('Added to wishlist');
      }
    } else {
      toast.error('Failed to update wishlist. Please try again.');
    }
  };

  const hasSizes = product?.sizes && product.sizes.length > 0;
  const availableSize = hasSizes ? product.sizes.find((s) => Number(s.stock) > 0) : null;
  const canAdd = hasSizes 
    ? (availableSize && Number(availableSize.stock) > 0)
    : product.countInStock > 0;
  
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const discount = product.isOnSale && product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden group h-full flex flex-col"
    >
      <div className="relative w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isOnSale && discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {discount}% OFF
          </div>
        )}
        {showWishlist && (
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-black rounded-full shadow-md hover:scale-110 transition-transform z-10"
          >
            {isInWishlist(product._id) ? (
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold text-base mt-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{product.color}</p>
        
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span className="text-sm font-medium ml-1">{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({product.numReviews || 0})</span>
        </div>

        <div className="flex justify-between items-center mt-auto pt-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-bold text-xl">₹{displayPrice.toLocaleString('en-IN')}</p>
              {product.isOnSale && product.salePrice && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</p>
              )}
            </div>
          </div>
          <p className={`text-xs font-medium ${product.countInStock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
          </p>
        </div>

        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={`w-full mt-4 py-2 rounded-lg font-medium transition-all ${
              canAdd
                ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {canAdd ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  );
}
