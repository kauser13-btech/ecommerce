'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function PromoCodeForm({ initialData, isEdit }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'fixed',
        value: '',
        min_order_amount: '',
        expires_at: '',
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                min_order_amount: initialData.min_order_amount || '',
                expires_at: initialData.expires_at ? initialData.expires_at.split('T')[0] : '', // Format date for input
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                value: parseFloat(formData.value),
                min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
            };

            if (isEdit) {
                await api.put(`/promocodes/${initialData.id}`, data);
                toast.success('Promo code updated');
            } else {
                await api.post('/promocodes', data);
                toast.success('Promo code created');
            }
            router.push('/dashboard/promocodes');
        } catch (error) {
            console.error('Error saving promo code:', error);
            const message = error.response?.data?.message || 'Failed to save promo code';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/promocodes"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Promo Code' : 'New Promo Code'}
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Save Code
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {/* Code & Active */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase"
                            placeholder="e.g. SUMMER2024"
                            required
                        />
                    </div>
                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                    </div>
                </div>

                {/* Type & Value */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="fixed">Fixed Amount (৳)</option>
                            <option value="percent">Percentage (%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. 100 or 10"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                {/* Min Order & Expiry */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount (Optional)</label>
                        <input
                            type="number"
                            name="min_order_amount"
                            value={formData.min_order_amount}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. 500"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
                        <input
                            type="date"
                            name="expires_at"
                            value={formData.expires_at}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
