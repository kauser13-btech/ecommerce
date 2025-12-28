'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedProductGrid({ featuredProducts = [] }) {
    const LIMIT = 4;
    let displayItems = [];

    // Process provided products
    if (featuredProducts && Array.isArray(featuredProducts)) {
        displayItems = featuredProducts.map(p => ({
            id: p.id,
            title: p.name,
            image: p.image || '/placeholder.png',
            link: `/products/${p.slug}`,
            price: p.price
        }));
    }

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
                        item.isSkeleton ? (
                            <div key={item.id} className="group block bg-white rounded-3xl overflow-hidden">
                                <div className="relative aspect-square bg-gray-200 animate-pulse" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={item.id}
                                href={item.link}
                                className="group block bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                            >
                                <div className="relative aspect-square p-6 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />
                                </div>
                                <div className="text-center p-2">
                                    <h3 className="font-semibold text-gray-700 text-lg group-hover:text-black transition-colors truncate px-2">
                                        {item.title}
                                    </h3>

                                </div>
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}
