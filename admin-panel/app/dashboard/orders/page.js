'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Eye, Loader2, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const ORDER_STATUSES = {
    'Core': [
        { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
        { id: 'processing', label: 'Processing', color: 'bg-indigo-100 text-indigo-800' },
        { id: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
        { id: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800' },
        { id: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    ],
    'Payment': [
        { id: 'payment_pending', label: 'Payment Pending', color: 'bg-gray-100 text-gray-800' },
        { id: 'paid', label: 'Paid', color: 'bg-green-50 text-green-700' },
        { id: 'payment_failed', label: 'Payment Failed', color: 'bg-red-50 text-red-700' },
        { id: 'refunded', label: 'Refunded', color: 'bg-gray-200 text-gray-700' },
    ],
    'Cancellation': [
        { id: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
        { id: 'returned', label: 'Returned', color: 'bg-red-50 text-red-600' },
        { id: 'return_requested', label: 'Return Requested', color: 'bg-orange-50 text-orange-600' },
        { id: 'return_approved', label: 'Return Approved', color: 'bg-green-50 text-green-600' },
    ],
    'Problem': [
        { id: 'on_hold', label: 'On Hold', color: 'bg-amber-100 text-amber-800' },
        { id: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
        { id: 'expired', label: 'Expired', color: 'bg-gray-100 text-gray-800' },
    ]
};

const FLAT_STATUSES = Object.values(ORDER_STATUSES).flat().reduce((acc, status) => {
    acc[status.id] = status;
    return acc;
}, {});

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
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
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Package className="h-6 w-6" />
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const statusConfig = FLAT_STATUSES[order.order_status] || { label: order.order_status, color: 'bg-gray-100' };
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.order_number || `#${order.id}`}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{order.customer_name}</div>
                                                <div className="text-xs text-gray-500">{order.customer_phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">৳{Number(order.total).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                {statusConfig.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/orders/${order.id}`}
                                                className="p-2 inline-flex text-gray-400 hover:text-blue-600 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
