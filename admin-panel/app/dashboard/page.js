'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, Tag, Gift, Eye, ArrowRight, Plus } from 'lucide-react';
import api from '../lib/api';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        activePromos: 0,
        totalOffers: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all data in parallel
                const [productsRes, ordersRes, promosRes, offersRes] = await Promise.allSettled([
                    api.get('/products'),
                    api.get('/orders'),
                    api.get('/promocodes'),
                    api.get('/offers')
                ]);

                // Helper to get data or empty array if failed
                const getCount = (res) => {
                    if (res.status === 'fulfilled' && res.value.data) {
                        const data = res.value.data.data || res.value.data;
                        return Array.isArray(data) ? data : [];
                    }
                    return [];
                };

                const products = getCount(productsRes);
                const orders = getCount(ordersRes);
                const promos = getCount(promosRes);
                const offers = getCount(offersRes);

                // Calculate active promos (locally filtering for robustness)
                const activePromosCount = promos.filter(p => p.is_active || p.status === 'active').length;

                setStats({
                    totalProducts: products.length,
                    totalOrders: orders.length,
                    activePromos: activePromosCount,
                    totalOffers: offers.length
                });

                // Set recent orders (top 10)
                setRecentOrders(orders.slice(0, 10));

            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
                {loading ? '...' : value}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/products/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        New Product
                    </Link>
                    <Link
                        href="/dashboard/offers/new"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        New Offer
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Active Promos"
                    value={stats.activePromos}
                    icon={Tag}
                    color="bg-green-500"
                />
                <StatCard
                    title="Offers"
                    value={stats.totalOffers}
                    icon={Gift}
                    color="bg-orange-500"
                />
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <Link
                        href="/dashboard/orders"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        View All Orders
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                            <div className="text-xs text-gray-500">{order.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.order_status)}`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                            ৳{Number(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/orders/${order.id}`}
                                                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Order"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
