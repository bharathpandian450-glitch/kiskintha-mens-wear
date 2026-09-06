import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Sync cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size = 'M', quantity = 1, color = '', customImage = '') => {
        const itemColor = color || product.selectedColor || '';
        const itemImage = customImage || product.image;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.size === size && item.color === itemColor);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id && item.size === size && item.color === itemColor
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: itemImage,
                size,
                color: itemColor,
                sleeve_type: product.sleeve_type || '',
                category_name: product.category_name || '',
                quantity
            }];
        });
    };

    const removeFromCart = (id, size, color = '') => {
        setCart(prev => prev.filter(item => !(item.id === id && item.size === size && (color ? item.color === color : true))));
    };

    const updateQuantity = (id, size, quantity, color = '') => {
        if (quantity < 1) return;
        setCart(prev =>
            prev.map(item =>
                item.id === id && item.size === size && (color ? item.color === color : true)
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
