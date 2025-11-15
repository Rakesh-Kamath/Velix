import { createContext, useContext, useState } from "react";

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [comparisonProducts, setComparisonProducts] = useState([]);

  const addToComparison = (product) => {
    if (comparisonProducts.length >= 4) {
      alert("You can compare up to 4 products at a time");
      return false;
    }
    if (comparisonProducts.some((p) => p._id === product._id)) {
      alert("Product is already in comparison");
      return false;
    }
    setComparisonProducts([...comparisonProducts, product]);
    return true;
  };

  const removeFromComparison = (productId) => {
    setComparisonProducts(
      comparisonProducts.filter((p) => p._id !== productId)
    );
  };

  const clearComparison = () => {
    setComparisonProducts([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

