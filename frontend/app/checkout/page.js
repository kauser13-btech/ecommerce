'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../../lib/api';
import { ChevronLeft, Info, Truck, CreditCard, Banknote, Store } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Placeholder data for dropdowns
const DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];
const DISTRICTS = ['Dhaka', 'Gazipur', 'Narayanganj', 'Chittagong', 'Cox\'s Bazar', 'Comilla'];
const UPAZILAS = ['Savar', 'Dhamrai', 'Keraniganj', 'Nawabganj', 'Dohar'];

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartTotal, promoCode, discountAmount, applyPromo, removePromo, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        division: '',
        district: '',
        upazila: '',
        post_code: '',
        address: '',
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
            router.push('/cart');
        }
    }, [cartItems, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: cartItems,
                shipping_address: `${formData.address}, ${formData.upazila}, ${formData.district}, ${formData.division} - ${formData.post_code}`,
                promo_code: promoCode?.code || null
            };

            await api.post('/orders', orderData);

            clearCart();
            toast.success('Order placed successfully!');
            router.push('/checkout/success');
        } catch (error) {
            console.error('Order placement error:', error);
            const message = error.response?.data?.message || 'Failed to place order';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const subtotal = getCartTotal();
    const deliveryCharge = formData.delivery_method === 'pickup' ? 0 : 100;
    const finalTotal = subtotal + deliveryCharge - discountAmount;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/cart" className="flex items-center gap-1 text-gray-600 hover:text-black font-medium text-sm">
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Checkout & Confirm Order</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8">
                {/* Alert Banner */}
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-800">
                        অর্ডার সংক্রান্ত যেকোনো প্রয়োজনে কথা বলুন আমাদের কাস্টমার সার্ভিস প্রতিনিধির সাথে - 09678148148
                    </p>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Delivery Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter full name"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="customer_email"
                                        value={formData.customer_email}
                                        onChange={handleInputChange}
                                        placeholder="Enter Email"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customer_phone"
                                        value={formData.customer_phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Division */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Division <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="division"
                                        value={formData.division}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white"
                                    >
                                        <option value="">Select your division</option>
                                        {DIVISIONS.map(div => (
                                            <option key={div} value={div}>{div}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* District */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        District <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white"
                                    >
                                        <option value="">Select your city</option>
                                        {DISTRICTS.map(dist => (
                                            <option key={dist} value={dist}>{dist}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Upazila */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upazila <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="upazila"
                                        value={formData.upazila}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white"
                                    >
                                        <option value="">Select your area</option>
                                        {UPAZILAS.map(upa => (
                                            <option key={upa} value={upa}>{upa}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Post Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Post Code
                                    </label>
                                    <input
                                        type="text"
                                        name="post_code"
                                        value={formData.post_code}
                                        onChange={handleInputChange}
                                        placeholder="Enter Post Code"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="For ex: House: 23, Road: 24, Block: B"
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Payment Method */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.payment_method === 'cod'
                                            ? 'border-orange-500 bg-orange-50/50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cod"
                                            checked={formData.payment_method === 'cod'}
                                            onChange={handleInputChange}
                                            className="absolute top-3 right-3 text-orange-600 focus:ring-orange-500"
                                        />
                                        <Banknote className={`w-8 h-8 mb-2 ${formData.payment_method === 'cod' ? 'text-orange-600' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-medium ${formData.payment_method === 'cod' ? 'text-orange-900' : 'text-gray-600'}`}>Cash on Delivery</span>
                                    </label>

                                    <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.payment_method === 'online'
                                            ? 'border-orange-500 bg-orange-50/50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="online"
                                            checked={formData.payment_method === 'online'}
                                            onChange={handleInputChange}
                                            className="absolute top-3 right-3 text-orange-600 focus:ring-orange-500"
                                        />
                                        <CreditCard className={`w-8 h-8 mb-2 ${formData.payment_method === 'online' ? 'text-orange-600' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-medium ${formData.payment_method === 'online' ? 'text-orange-900' : 'text-gray-600'}`}>Online Payment</span>
                                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded mt-1">SSLCOMMERZ</span>
                                    </label>
                                </div>
                            </div>

                            {/* Delivery Method */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-900">Delivery Method</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.delivery_method === 'courier'
                                            ? 'border-orange-500 bg-orange-50/50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="courier"
                                            checked={formData.delivery_method === 'courier'}
                                            onChange={handleInputChange}
                                            className="absolute top-3 right-3 text-orange-600 focus:ring-orange-500"
                                        />
                                        <Truck className={`w-8 h-8 mb-2 ${formData.delivery_method === 'courier' ? 'text-orange-600' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-medium ${formData.delivery_method === 'courier' ? 'text-orange-900' : 'text-gray-600'}`}>Courier Service</span>
                                    </label>

                                    <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.delivery_method === 'pickup'
                                            ? 'border-orange-500 bg-orange-50/50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="pickup"
                                            checked={formData.delivery_method === 'pickup'}
                                            onChange={handleInputChange}
                                            className="absolute top-3 right-3 text-orange-600 focus:ring-orange-500"
                                        />
                                        <Store className={`w-8 h-8 mb-2 ${formData.delivery_method === 'pickup' ? 'text-orange-600' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-medium ${formData.delivery_method === 'pickup' ? 'text-orange-900' : 'text-gray-600'}`}>Shop Pickup</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Cart Items List */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{item.quantity} quantity</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Apply Coupon</label>
                                {!promoCode ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Apply Coupon"
                                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => applyPromo(couponCode)}
                                            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Apply Coupon
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center justify-between text-sm text-green-800">
                                        <span><strong>{promoCode.code}</strong> applied!</span>
                                        <button onClick={removePromo} type="button" className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-6 border-t border-gray-100 text-sm">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Sub Total ({cartItems.length} items)</span>
                                    <span className="text-gray-900">৳ {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Delivery</span>
                                    <span className="text-gray-900 flex items-center gap-1">
                                        <Info className="w-3 h-3 text-orange-500" />
                                        {deliveryCharge > 0 ? `৳ ${deliveryCharge}` : 'Free'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Discount</span>
                                    <span className="text-gray-900">৳ {discountAmount}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
                                    <span>Total Amount</span>
                                    <span>৳ {finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="mt-6">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-xs text-gray-600 leading-relaxed">
                                        I have read & agree to the website <Link href="/terms" className="text-orange-600 hover:underline">Terms and Conditions</Link>
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !termsAccepted}
                                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none transition-all"
                            >
                                {loading ? 'Processing...' : 'Confirm & Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
