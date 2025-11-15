import { Link } from "react-router-dom";
import { useComparison } from "../context/ComparisonContext";
import { useCart } from "../context/CartContext";

export default function Comparison() {
  const { comparisonProducts, removeFromComparison, clearComparison } =
    useComparison();
  const { addToCart } = useCart();

  if (comparisonProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">Product Comparison</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            No products selected for comparison
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    const availableSize = product.sizes.find((s) => s.stock > 0);
    if (availableSize) {
      addToCart(product, availableSize.size, 1);
      alert("Added to cart!");
    } else {
      alert("This product is out of stock");
    }
  };

  const getAvailableSizes = (product) => {
    return product.sizes.filter((s) => s.stock > 0).map((s) => s.size);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Product Comparison</h1>
        <button
          onClick={clearComparison}
          className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-red-500 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg">
          <thead>
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 p-4 text-left">
                Feature
              </th>
              {comparisonProducts.map((product) => (
                <th
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4 text-left min-w-[250px]"
                >
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => removeFromComparison(product._id)}
                      className="self-end mb-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                    <Link
                      to={`/product/${product._id}`}
                      className="no-underline text-inherit"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg mb-2"
                      />
                      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {product.brand}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                Price
              </td>
              {comparisonProducts.map((product) => (
                <td
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4"
                >
                  ${product.price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                Rating
              </td>
              {comparisonProducts.map((product) => (
                <td
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4"
                >
                  {product.rating > 0 ? (
                    <div>
                      ⭐ {product.rating.toFixed(1)} ({product.numReviews}{" "}
                      reviews)
                    </div>
                  ) : (
                    <span className="text-gray-500">No ratings yet</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                Category
              </td>
              {comparisonProducts.map((product) => (
                <td
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4 capitalize"
                >
                  {product.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                Color
              </td>
              {comparisonProducts.map((product) => (
                <td
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4"
                >
                  {product.color}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                Available Sizes
              </td>
              {comparisonProducts.map((product) => (
                <td
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {getAvailableSizes(product).length > 0 ? (
                      getAvailableSizes(product).map((size) => (
                        <span
                          key={size}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-sm"
                        >
                          {size}
                        </span>
                      ))
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                Description
              </td>
              {comparisonProducts.map((product) => (
                <td
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4 text-sm"
                >
                  {product.description}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                Actions
              </td>
              {comparisonProducts.map((product) => (
                <td
                  key={product._id}
                  className="border border-gray-300 dark:border-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={getAvailableSizes(product).length === 0}
                      className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

