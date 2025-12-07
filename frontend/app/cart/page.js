'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

import { useState } from 'react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, applyPromo, removePromo, promoCode, discountAmount } = useCart();
  const [code, setCode] = useState('');

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 100 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some products to get started</p>
              <a
                href="/products"
                className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex gap-6">
                        {/* Image */}
                        <a href={`/products/${item.slug}`} className="flex-shrink-0 group">
                          <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:border-orange-200 transition-colors">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                        </a>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <a
                                href={`/products/${item.slug}`}
                                className="font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </a>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Remove item"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.selectedColor && <span className="mr-3">Color: {item.selectedColor}</span>}
                              {item.selectedStorage && <span>Storage: {item.selectedStorage}</span>}
                            </p>
                          </div>

                          <div className="flex items-end justify-between mt-4">
                            {/* Quantity */}
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black font-bold text-lg hover:bg-white rounded-full transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black font-bold text-lg hover:bg-white rounded-full transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900">
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500">
                                  ৳{item.price.toLocaleString()} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div>
                  <a
                    href="/products"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors group"
                  >
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </a>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-sm p-8 sticky top-24 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-gray-900">{shipping === 0 ? 'FREE' : `৳${shipping.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (5%)</span>
                      <span className="font-semibold text-gray-900">৳{tax.toLocaleString()}</span>
                    </div>

                    {promoCode && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({promoCode.code})</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">-৳{discountAmount.toLocaleString()}</span>
                          <button onClick={removePromo} className="text-red-500 hover:text-red-700 text-xs underline">Remove</button>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-end">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">৳{(total - discountAmount).toLocaleString()}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all mb-4 flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>

                  <div className="mt-8">
                    {!promoCode ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Promo Code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all pr-24"
                        />
                        <button
                          onClick={() => applyPromo(code)}
                          className="absolute right-2 top-2 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center justify-between text-sm text-green-800">
                        <span>Promo code <strong>{promoCode.code}</strong> applied!</span>
                      </div>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">Secure Payment</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
