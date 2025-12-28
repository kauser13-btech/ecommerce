'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../lib/api';

export default function ShopByBrands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                // Fetch only brands marked for homepage display, sorted by sort_order
                const response = await api.get('/brands?show_on_home=1&is_active=1');
                const data = response.data.data || response.data;
                setBrands(data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <div className="w-full mt-12 mb-12">
                <section className="max-w-7xl mx-auto px-4">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[3/2] bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    if (brands.length === 0) return null;

    return (
        <section className="w-full py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">
                        <span className="text-black">Shop by</span> <span className="text-orange-500">Brands</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/products?brand=${brand.slug}`}
                            className="group block"
                        >
                            <div className="relative aspect-[3/2] bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center p-4 overflow-hidden">
                                <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {brand.logo ? (
                                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-600 transition-colors">
                                        {brand.name}
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {brand.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
