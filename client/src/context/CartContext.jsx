import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem('z-era-cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('z-era-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, size, qty = 1) => {
        setItems(prev => {
            const key = `${product.id}-${size}`;
            const existing = prev.find(i => i.key === key);
            if (existing) {
                return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + qty } : i);
            }
            return [...prev, {
                key,
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                size,
                quantity: qty,
                image: product.images?.[0] || '',
                category: product.category?.name || ''
            }];
        });
    };

    const removeItem = (key) => {
        setItems(prev => prev.filter(i => i.key !== key));
    };

    const updateQuantity = (key, qty) => {
        if (qty < 1) return removeItem(key);
        setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i));
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, isOpen, setIsOpen, addItem, removeItem,
            updateQuantity, clearCart, totalItems, totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
