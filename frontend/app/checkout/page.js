'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Info, Home, ChevronRight, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartTotal, promoCode, discountAmount, applyPromo, removePromo, clearCart, toggleCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        division: '', // Not used in form but might be expected by backend even if nullable
        district: '', // Mapped from City
        upazila: '',  // Not used
        post_code: '',
        shipping_address: '',
        apartment_suite: '', // Added for the optional apartment field
        payment_method: 'cod',
        delivery_method: 'courier'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customer_name: user.name || '',
                customer_email: user.email || '',
                customer_phone: user.phone || ''
            }));
        }
    }, [user]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/');
        }
    }, [cartItems, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async () => {
        if (!termsAccepted) {
            toast.error('Please accept the Terms and Conditions');
            return;
        }

        if (!formData.customer_name || !formData.shipping_address || !formData.district || !formData.customer_phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: cartItems,
                // Ensure District is set from City input
                district: formData.district,
                promo_code: promoCode?.code || null
            };

            await api.post('/orders', orderData);

            clearCart();
            toast.success('Order placed successfully!');
            router.push('/checkout/success');
        } catch (error) {
            console.error('Order placement error:', error);

            let message = 'Failed to place order';

            if (error.response?.data) {
                // Handle backend Validation errors (Laravel 422)
                if (error.response.data.errors) {
                    // Combine all validation errors into a single string or just take the first one
                    const validationErrors = Object.values(error.response.data.errors).flat();
                    message = validationErrors.length > 0 ? validationErrors[0] : error.response.data.message;
                }
                // Handle Custom Exception message from Controller (400)
                else if (error.response.data.error) {
                    message = `${error.response.data.message}: ${error.response.data.error}`;
                }
                // Fallback to general message
                else if (error.response.data.message) {
                    message = error.response.data.message;
                }
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const courierCost = 400;
    const shippingCost = formData.delivery_method === 'pickup' ? 0 : courierCost;
    const subtotal = getCartTotal();
    const finalTotal = subtotal + shippingCost - discountAmount;

    return (
        <>
            <Header />
            <div className="bg-gray-50 pt-28 pb-12">
                <div className="max-w-7xl mx-auto px-4 mt-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-orange-500 transition-colors flex items-center gap-1">
                            <Home size={16} />
                            <span>Home</span>
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <button onClick={toggleCart} className="hover:text-orange-500 transition-colors flex items-center gap-1">
                            <ShoppingCart size={16} />
                            <span>Cart</span>
                        </button>
                        <ChevronRight size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">Checkout</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Column - Form */}
                        <div className="space-y-8 bg-white rounded-3xl p-8 shadow-lg">

                            {/* Delivery */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery</h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        required
                                        placeholder="Name"
                                        className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                        onChange={handleInputChange}
                                    />

                                    <input
                                        type="text"
                                        name="shipping_address"
                                        required
                                        placeholder="Street address, P.O. Box, etc."
                                        value={formData.shipping_address}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="apartment_suite"
                                        placeholder="Apartment, suite, etc. (optional)"
                                        value={formData.apartment_suite}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="district"
                                            required
                                            placeholder="City"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            name="post_code"
                                            placeholder="Postal code (optional)"
                                            value={formData.post_code}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="customer_phone"
                                            required
                                            placeholder="Phone"
                                            value={formData.customer_phone}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping method */}
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping method</h2>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <label className="p-4 bg-blue-50/30 border-b border-gray-200 flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="delivery_method"
                                                    value="courier"
                                                    checked={formData.delivery_method === 'courier'}
                                                    onChange={handleInputChange}
                                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-4 transition-all"
                                                />
                                                <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                                            </div>
                                            <span className="font-medium text-gray-900">Courier Delivery</span>
                                        </div>
                                        <span className="font-bold text-gray-900">৳{courierCost.toFixed(2)}</span>
                                    </label>
                                    <label className="p-4 bg-white flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="delivery_method"
                                                    value="pickup"
                                                    checked={formData.delivery_method === 'pickup'}
                                                    onChange={handleInputChange}
                                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-4 transition-all"
                                                />
                                                <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                                            </div>
                                            <span className="font-medium text-gray-900">Store Pickup</span>
                                        </div>
                                        <span className="font-bold text-gray-900">Free</span>
                                    </label>
                                </div>
                            </section>

                            {/* Payment */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="p-4 bg-blue-50/30 border-b border-gray-200 flex items-center gap-3">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                checked={formData.payment_method === 'cod'}
                                                onChange={handleInputChange}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-4 transition-all"
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                                        </div>
                                        <span className="font-medium text-gray-900">Payment Cash On Delivery</span>
                                    </div>
                                    <div className="p-4 flex items-center gap-3 bg-white opacity-60 cursor-not-allowed">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="online"
                                                disabled
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-4 transition-all"
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                                        </div>
                                        <span className="font-medium text-gray-900">Pay By Credit card/ Mobile Banking/ Net Banking <span className="text-sm text-orange-500">(Coming Soon)</span></span>
                                    </div>
                                </div>
                            </section>

                            {/* Billing Address */}
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Billing address</h2>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 flex items-center gap-3 cursor-pointer" onClick={() => setBillingSameAsShipping(true)}>
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="billing"
                                                checked={billingSameAsShipping}
                                                onChange={() => setBillingSameAsShipping(true)}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-4 transition-all"
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                                        </div>
                                        <span className="font-medium text-gray-900">Same as shipping address</span>
                                    </div>
                                    <div className={`p-4 flex items-center gap-3 cursor-pointer ${!billingSameAsShipping ? 'bg-blue-50/30' : ''}`} onClick={() => setBillingSameAsShipping(false)}>
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="billing"
                                                checked={!billingSameAsShipping}
                                                onChange={() => setBillingSameAsShipping(false)}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-4 transition-all"
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                                        </div>
                                        <span className="font-medium text-gray-900">Use a different billing address</span>
                                    </div>

                                    {/* Billing Form */}
                                    {!billingSameAsShipping && (
                                        <div className="p-4 bg-gray-50/50 border-t border-gray-200 space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Address"
                                                className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Apartment, suite, etc. (optional)"
                                                className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Postal code (optional)"
                                                    className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                                />
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    placeholder="Phone (optional)"
                                                    className="w-full p-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Summary */}
                        <div className="lg:pl-12">
                            <div className="bg-white shadow-lg rounded-3xl p-8 sticky top-32">
                                <h2 className="tex-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                                    <span>Order Summary</span>
                                    <span className="text-gray-500 font-normal text-sm">{cartItems.length} items</span>
                                </h2>

                                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 align-middle">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                                                {item.is_preorder && (
                                                    <div className="mb-1">
                                                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                                                            Pre-Order
                                                        </span>
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-500">{item.selectedOptions && Object.values(item.selectedOptions).join(' / ')}</p>
                                                <p className="text-sm text-gray-500">x {item.quantity}</p>
                                            </div>
                                            <div className="font-medium text-gray-900 whitespace-nowrap">
                                                ৳ {Number(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Promo Code */}
                                <div className="flex gap-2 mb-8">
                                    <input
                                        type="text"
                                        placeholder="Discount code or gift card"
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        disabled={!!promoCode}
                                    />
                                    {promoCode ? (
                                        <button
                                            className="bg-red-500 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors"
                                            onClick={removePromo}
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-gray-200 text-gray-500 font-bold px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => applyPromo(couponInput)}
                                            disabled={!couponInput}
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                                {promoCode && (
                                    <div className="mb-4 text-green-600 text-sm font-medium">
                                        Coupon {promoCode.code} applied!
                                    </div>
                                )}

                                <div className="space-y-3 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>৳ {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            Shipping
                                            <Info size={14} className="text-gray-400" />
                                        </span>
                                        <span className="text-gray-400">৳ {shippingCost.toFixed(2)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>Discount</span>
                                            <span>- ৳ {discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200 mt-4">
                                        <span>Total</span>
                                        <span className="flex items-baseline gap-1">
                                            <span className="text-sm font-normal text-gray-500">BDT</span>
                                            ৳ {finalTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="mt-6">
                                <label className="flex items-center justify-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-xs text-gray-600 leading-relaxed">
                                        I have read & agree to the website <Link href="/terms" className="text-orange-600 hover:underline">Terms and Conditions</Link>
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                onClick={handlePlaceOrder}
                                disabled={loading || !termsAccepted}
                                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none transition-all"
                            >
                                {loading ? 'Processing...' : 'Confirm & Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
