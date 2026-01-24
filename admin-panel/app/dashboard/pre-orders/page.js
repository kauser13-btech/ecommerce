'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Loader2, Calendar, Phone, MapPin, Package, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PreOrdersPage() {
    const [preOrders, setPreOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPreOrders();
    }, []);

    const fetchPreOrders = async () => {
        try {
            const response = await api.get('/admin/pre-orders');
            setPreOrders(response.data);
        } catch (error) {
            console.error('Error fetching pre-orders:', error);
            toast.error('Failed to load pre-orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Pre-Orders
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Contact</th>
                            <th className="px-6 py-3">Address</th>
                            <th className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {preOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="h-8 w-8 text-gray-300" />
                                        <p>No pre-orders found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            preOrders.map((order) => {
                                const displayImage = order.variant?.image || order.product?.image;
                                const getVariantText = (variant) => {
                                    if (!variant) return null;
                                    if (variant.variation_color_name) return variant.variation_color_name;
                                    if (variant.attributes) {
                                        try {
                                            const attrs = typeof variant.attributes === 'string' ? JSON.parse(variant.attributes) : variant.attributes;
                                            return Object.values(attrs).join(' / ');
                                        } catch (e) { return null; }
                                    }
                                    return null;
                                };
                                const variantText = getVariantText(order.variant);

                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {displayImage && (
                                                    <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 overflow-hidden border border-gray-200">
                                                        <img
                                                            src={displayImage}
                                                            alt={order.product?.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 line-clamp-1 max-w-[200px]" title={order.product?.name}>
                                                        {order.product?.name || 'Unknown Product'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        Qty: {order.quantity}
                                                        {variantText && (
                                                            <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                                                {variantText}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="font-medium text-gray-900">{order.customer_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                {order.customer_phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 line-clamp-2" title={order.customer_address}>
                                                    {order.customer_address}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
