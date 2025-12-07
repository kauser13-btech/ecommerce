'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now, or fetch from API if available
        // async function fetchStats() { ... }
        setStats({
            totalRevenue: 125000,
            totalOrders: 45,
            totalProducts: 12,
            totalCustomers: 8,
        });
        setLoading(false);
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Last 30 Days</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`৳${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
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
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
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
