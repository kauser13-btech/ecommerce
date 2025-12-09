'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Package, Tag, Gift } from 'lucide-react';
import api from '../lib/api';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        activePromos: 0,
        totalOffers: 0,
    });
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
                        // Assuming API resources return { data: [...] } or just [...]
                        // Standard Laravel resource usually returns object with data property for lists
                        // We'll check for headers or structure. If pagination, usually inside data.data
                        // Let's assume standard response based on models.

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
                const activePromosCount = promos.filter(p => p.is_active || p.status === 'active').length; // Check varies by API, using common flags

                setStats({
                    totalProducts: products.length,
                    totalOrders: orders.length,
                    activePromos: activePromosCount,
                    totalOffers: offers.length
                });

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
                <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
                {loading ? '...' : value}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Recent Orders Table Placeholder */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
                <div className="text-center py-8 text-gray-500">
                    No recent orders
                </div>
            </div>
        </div>
    );
}
