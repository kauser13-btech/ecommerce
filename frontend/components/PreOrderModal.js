'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PreOrderModal({ isOpen, onClose, product, variant, quantity }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/pre-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    customer_address: formData.address,
                    product_id: product.id,
                    variant_id: variant?.id,
                    quantity: quantity
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit pre-order');
            }

            toast.success('Pre-order submitted successfully! We will contact you soon.');
            onClose();
            setFormData({ name: '', phone: '', address: '' });
        } catch (error) {
            console.error('Error submitting pre-order:', error);
            toast.error('Failed to submit pre-order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Pre-Order Request</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4 bg-gray-50 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 p-1 flex-shrink-0">
                        <img
                            src={variant?.image || product.image || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                        {variant && (
                            <p className="text-sm text-gray-500">
                                {variant.sku}
                                {/* Add variant attributes here if needed */}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Quantity: <span className="font-medium text-gray-900">{quantity}</span>
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow resize-none"
                            placeholder="Enter your full address"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Submit Pre-Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}
