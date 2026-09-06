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
        const productIdStr = String(product.id);

        setCart(prev => {
            const existing = prev.find(item => String(item.id) === productIdStr && item.size === size && (itemColor ? item.color === itemColor : true));
            if (existing) {
                return prev.map(item =>
                    String(item.id) === productIdStr && item.size === size && (itemColor ? item.color === itemColor : true)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: itemImage,
                size,
                color: itemColor,
                sleeve_type: product.sleeve_type || '',
                category_name: product.category_name || '',
                quantity: Number(quantity) || 1
            }];
        });
    };

    const removeFromCart = (id, size, color = '') => {
        const targetIdStr = String(id);
        setCart(prev => prev.filter(item => !(String(item.id) === targetIdStr && item.size === size && (color ? item.color === color : true))));
    };

    const updateQuantity = (id, size, quantity, color = '') => {
        if (quantity < 1) return;
        const targetIdStr = String(id);
        setCart(prev =>
            prev.map(item =>
                String(item.id) === targetIdStr && item.size === size && (color ? item.color === color : true)
                    ? { ...item, quantity: Number(quantity) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        try {
            localStorage.removeItem('cart');
        } catch (e) {}
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
