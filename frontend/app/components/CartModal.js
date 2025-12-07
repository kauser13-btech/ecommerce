'use client';

import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag } from 'lucide-react';

export default function CartModal() {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        getCartTotal,
        isCartOpen,
        toggleCart,
        applyPromo,
        removePromo,
        promoCode,
        discountAmount
    } = useCart();
    const router = useRouter();

    const [code, setCode] = useState('');

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setCode(''); // Reset code input
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 100 : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            />

            {/* Modal Panel (Slide-over) */}
            <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-900" />
                        <h2 className="text-lg font-bold text-gray-900">Shopping Cart ({cartItems.length})</h2>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                            <button
                                onClick={toggleCart}
                                className="text-orange-600 font-medium hover:text-orange-700 hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Cart Items */}
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.selectedColor && `Color: ${item.selectedColor} `}
                                                    {item.selectedStorage && `| Storage: ${item.selectedStorage}`}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 rounded-l-lg"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 rounded-r-lg"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    ৳{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code */}
                            <div className="pt-4 border-t border-gray-100">
                                {!promoCode ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Promo Code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-20"
                                        />
                                        <button
                                            onClick={() => applyPromo(code)}
                                            className="absolute right-1.5 top-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center justify-between text-sm text-green-800">
                                        <span className="flex items-center gap-2">
                                            <span className="font-semibold">{promoCode.code}</span> applied
                                        </span>
                                        <button onClick={removePromo} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `৳${shipping.toLocaleString()}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (5%)</span>
                                    <span>৳{tax.toLocaleString()}</span>
                                </div>
                                {promoCode && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Discount</span>
                                        <span>-৳{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-dashed border-gray-200">
                                    <span>Total</span>
                                    <span className="text-orange-600">৳{(total - discountAmount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={() => {
                                toggleCart();
                                router.push('/checkout');
                            }}
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            Checkout Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                        <button
                            onClick={toggleCart}
                            className="w-full mt-3 text-center text-sm text-gray-500 hover:text-gray-900"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
