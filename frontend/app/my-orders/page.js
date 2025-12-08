'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link'; // Import Link
import { useAuth } from '../context/AuthContext';
import { Package, Search } from 'lucide-react';
import api from '../../lib/api';

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch orders if user is logged in
        // For now, we'll simulate an empty state or fetch from API if exists
        async function fetchOrders() {
            try {
                if (user) {
                    // const response = await api.get('/orders');
                    // setOrders(response.data);
                    // Simulated delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setOrders([]);
                }
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            fetchOrders();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </main>
                <Footer />
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h1 className="text-2xl font-bold mb-4">Please log in to view your orders</h1>
                        {/* Login button or redirect can be handled by AuthContext or separate logic */}
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="max-w-6xl min-h-[calc(100vh-600px)] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        {/* Optional: Filter/Sort controls */}
                    </div>

                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Order #{order.order_number}</p>
                                            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                            <span className="font-bold text-gray-900">৳{order.total_amount}</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {/* Order items would go here */}
                                        <p className="text-sm text-gray-500">Items...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Looks like you haven't placed any orders yet. Start shopping to find amazing products!
                            </p>
                            <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
