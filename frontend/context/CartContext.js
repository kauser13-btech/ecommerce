'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart data:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        // Check if item exists outside of state updater to prevent double toasts
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            toast.success('Cart updated');
            setCartItems(prevItems => prevItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            toast.success('Added to cart');
            setCartItems(prevItems => [...prevItems, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const [promoCode, setPromoCode] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    const applyPromo = async (code) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            // Calculate current total
            const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

            const response = await fetch(`${apiUrl}/promocodes/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    cart_total: subtotal
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Failed to apply promo code');
                return false;
            }

            setPromoCode({
                code: data.code,
                type: data.type,
                value: data.value
            });
            setDiscountAmount(data.discount_amount);
            toast.success('Promo code applied!');
            return true;
        } catch (error) {
            console.error('Error applying promo code:', error);
            toast.error('Something went wrong');
            return false;
        }
    };

    const removePromo = () => {
        setPromoCode(null);
        setDiscountAmount(0);
        toast.success('Promo code removed');
    };

    // Recalculate discount if cart changes
    useEffect(() => {
        if (promoCode) {
            const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            // Basic re-validation could be here, but for now we just re-calc percent
            if (promoCode.type === 'percent') {
                setDiscountAmount((subtotal * promoCode.value) / 100);
            } else {
                setDiscountAmount(Math.min(promoCode.value, subtotal));
            }
        }
    }, [cartItems, promoCode]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            promoCode,
            discountAmount,
            applyPromo,
            removePromo,
            isCartOpen,
            setIsCartOpen,
            toggleCart: () => setIsCartOpen(prev => !prev)
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
