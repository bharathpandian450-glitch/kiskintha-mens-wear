import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('kmw_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kmw_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = 'L', color = 'Standard', quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product_id === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const price = product.discount_price || product.price;
        const newItem = {
          id: Date.now(),
          product_id: product.id,
          product_name: product.name,
          price: price,
          original_price: product.price,
          product_image: (product.images && product.images[0]) || product.image || '/picture/linen 1.jpg',
          category_name: product.category_name,
          subcategory: product.subcategory,
          size: size,
          color: color,
          quantity: quantity
        };
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
