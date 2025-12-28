'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './ProductCard';

export default function FeaturedProductGrid({ featuredProducts = [] }) {
    const LIMIT = 4;
    let displayItems = Array.isArray(featuredProducts) ? [...featuredProducts] : [];

    // Fill with skeletons up to LIMIT
    while (displayItems.length < LIMIT) {
        displayItems.push({
            id: `skeleton-${displayItems.length}`,
            isSkeleton: true
        });
    }

    // Enforce strict limit if API returns more
    displayItems = displayItems.slice(0, LIMIT);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">
                        <span className="text-black">Featured</span> <span className="text-orange-500">Products</span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayItems.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            isSkeleton={item.isSkeleton}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
