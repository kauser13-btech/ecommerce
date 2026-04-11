'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Eye, Loader2, ArrowLeft, Clock, Package } from 'lucide-react';
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

export default function OrderDetailsPage() {
    const { id } = useParams();
    
    const [order, setOrder] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const [orderRes, logsRes] = await Promise.all([
                api.get(`/orders/${id}`),
                api.get(`/orders/${id}/logs`).catch(() => ({ data: [] }))
            ]);
            setOrder(orderRes.data.data || orderRes.data || orderRes);
            setLogs(logsRes.data || []);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!order) return;
        setStatusLoading(true);
        try {
            const response = await api.put(`/orders/${order.id}/status`, { status: newStatus });
            
            // Re-fetch details completely or update state
            setOrder(response.data.order || response.data.data || response.data);
            
            // Refresh logs
            const logsRes = await api.get(`/orders/${id}/logs`).catch(() => ({ data: [] }));
            setLogs(logsRes.data || []);
            
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setStatusLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="text-gray-500 mb-4">Order not found</div>
                <Link href="/dashboard/orders" className="text-blue-600 hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10 mt-6">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4 px-4 sm:px-0">
                <Link 
                    href="/dashboard/orders"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center bg-white border border-gray-200"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="h-6 w-6" />
                        Order {order.order_number || `#${order.id}`}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                {/* Left Column: Status & Items */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Status Section */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
                        <div className="relative">
                            <select
                                value={order.order_status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={statusLoading}
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                {Object.entries(ORDER_STATUSES).map(([category, statuses]) => (
                                    <optgroup key={category} label={category}>
                                        {statuses.map(status => (
                                            <option key={status.id} value={status.id}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                            {statusLoading && (
                                <div className="absolute inset-y-0 right-8 flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Items ({(order.order_items || order.orderItems)?.length || 0})</h3>
                        <div className="space-y-4">
                            {(order.order_items || order.orderItems)?.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                        {item.product?.image ? (
                                            <img src={item.product.image} alt={item.product_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <Eye className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Qt: {item.quantity} × ৳{Number(item.price).toLocaleString()}
                                        </p>
                                        {item.variation && (
                                            <p className="text-xs text-gray-500 mt-1 bg-white border border-gray-200 inline-block px-2 py-1 rounded">
                                                {typeof item.variation === 'string'
                                                    ? (() => {
                                                        try {
                                                            const v = JSON.parse(item.variation);
                                                            return Object.values(v || {}).join(' / ');
                                                        } catch (e) { return item.variation }
                                                    })()
                                                    : Object.values(item.variation || {}).join(' / ')
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right font-medium text-gray-900">
                                        ৳{Number(item.subtotal || item.total).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-gray-100 pt-6 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>৳{Number(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>৳{Number(order.shipping_cost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Discount</span>
                                <span>-৳{Number(order.discount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-50 mt-2">
                                <span>Total</span>
                                <span>৳{Number(order.total).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Logs */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Customer Details</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <label className="text-xs text-gray-500 block">Name</label>
                                <div className="font-medium text-gray-900">{order.customer_name}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block">Email</label>
                                <div className="font-medium text-gray-900 truncate">{order.customer_email || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block">Phone</label>
                                <div className="font-medium text-gray-900">{order.customer_phone}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block">Shipping Address</label>
                                <div className="font-medium text-gray-900 leading-relaxed">{order.shipping_address}</div>
                            </div>
                            {(order.division || order.district) && (
                                <div>
                                    <label className="text-xs text-gray-500 block">Location</label>
                                    <div className="font-medium text-gray-900">
                                        {[order.district, order.division].filter(Boolean).join(', ')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Logs */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            Order History
                        </h3>
                        <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-px before:bg-gray-100">
                            {logs.map((log) => (
                                <div key={log.id} className="relative pl-10">
                                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">
                                            Status changed to <span className="text-blue-600">{FLAT_STATUSES[log.new_status]?.label || log.new_status}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            by {log.user?.name || 'System'} • {new Date(log.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {/* Initial Order */}
                            <div className="relative pl-10">
                                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">Order Placed</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(order?.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
