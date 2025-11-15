import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      if (res.data.sizes && res.data.sizes.length > 0) {
        const availableSize = res.data.sizes.find((s) => s.stock > 0);
        if (availableSize) setSelectedSize(availableSize.size);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, selectedSize, qty);
    alert("Added to cart!");
  };

  if (loading) {
    return <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12 text-xl">Product not found</div>;
  }

  const availableSizes = product.sizes.filter((s) => s.stock > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg mb-8 hover:opacity-80 transition-opacity"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-lg">
        <div className="w-full h-96 lg:h-[500px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{product.brand}</p>
          {product.rating > 0 && (
            <div className="text-lg mb-4">
              ⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </div>
          )}
          <p className="text-4xl font-bold mb-6">${product.price}</p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{product.description}</p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Select Size:</h3>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.length > 0 ? (
                availableSizes.map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === sizeObj.size
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : "bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
                    }`}
                    onClick={() => setSelectedSize(sizeObj.size)}
                  >
                    {sizeObj.size}
                  </button>
                ))
              ) : (
                <p className="font-medium">Out of Stock</p>
              )}
            </div>
          </div>

          {availableSizes.length > 0 && (
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
                        availableSizes.find((s) => s.size === selectedSize)?.stock || 1
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
            disabled={!selectedSize || availableSizes.length === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

