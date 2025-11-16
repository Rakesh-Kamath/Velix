import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, qty = 1) => {
    setCartItems((prevItems) => {
      const pid = product?._id || product?.id || null;
      const existingItem = prevItems.find((item) => {
        const itemPid = item.product && (item.product._id || item.product.id);
        return itemPid === pid && item.size === size;
      });

      const productToStore = pid ? { ...product, _id: pid } : { ...product };

      if (existingItem) {
        return prevItems.map((item) => {
          const itemPid = item.product && (item.product._id || item.product.id);
          return itemPid === pid && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item;
        });
      } else {
        return [...prevItems, { product: productToStore, size, qty }];
      }
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        const itemPid = item.product && (item.product._id || item.product.id);
        return !(itemPid === productId && item.size === size);
      })
    );
  };

  const updateCartItemQty = (productId, size, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const itemPid = item.product && (item.product._id || item.product.id);
        return itemPid === productId && item.size === size ? { ...item, qty } : item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.qty,
      0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

