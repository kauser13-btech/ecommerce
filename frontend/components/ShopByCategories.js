'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../lib/api';

export default function ShopByCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch only categories marked for homepage display, sorted by sort_order
                const response = await api.get('/categories?show_on_home=1&is_active=1');
                const data = response.data.data || response.data;
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            // <div className="bg-[url('/orange-bg.png')] bg-center bg-repeat-x w-full mt-12">
            <div className="w-full mt-12">
                <section className="max-w-7xl mx-auto px-4 py-10">
                    <div className="relative rounded-[2.5rem] overflow-hidden p-6 md:p-10 shadow-xl border border-white/40 bg-white/10 backdrop-blur-3xl">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-10"></div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        // <div className="bg-[url('/orange-bg.png')] bg-contain bg-center bg-repeat-x w-full mt-12">
        <div className="w-full mt-12">

            <section className="max-w-7xl mx-auto px-4 py-10">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">
                        <span className="text-black">Shop by</span> <span className="text-orange-500">Categories</span>
                    </h2>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {categories.map((category, idx) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            className={`group flex flex-col items-center gap-2 ${idx >= 6 ? 'hidden sm:flex' : 'flex'}`}
                        >
                            <div className="w-full aspect-square bg-white rounded-xl flex flex-col items-center justify-center p-3 transition-transform duration-300 shadow-sm hover:shadow-md hover:scale-105 border border-gray-100">
                                <div className="relative w-full h-full mb-2 transition-transform duration-300 group-hover:scale-110">
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">
                                            📦
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] md:text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>


            </section >
        </div >
    );
}
