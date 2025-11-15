import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [category, searchKeyword]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (searchKeyword) params.keyword = searchKeyword;
      
      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-16 px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl mb-12 transition-colors">
        <h1 className="text-5xl font-bold mb-4">Premium Sneakers Collection</h1>
        <p className="text-xl opacity-90">Step into style with our curated selection of premium sneakers</p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search sneakers..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg mb-4 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {["", "running", "basketball", "lifestyle", "skateboarding", "training"].map((cat) => (
            <button
              key={cat}
              className={`px-6 py-2 border-2 rounded-full font-medium transition-all ${
                category === cat
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat === "" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-xl text-gray-600 dark:text-gray-400">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 no-underline text-inherit block"
            >
              <div className="w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{product.brand}</p>
                <p className="text-2xl font-bold mb-2">${product.price}</p>
                {product.rating > 0 && (
                  <div className="text-sm">
                    ⭐ {product.rating.toFixed(1)} ({product.numReviews})
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

