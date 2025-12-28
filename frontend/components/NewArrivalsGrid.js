'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NewArrivalsGrid({ newArrivals = [] }) {
    const LIMIT = 8;
    let displayItems = [];

    if (newArrivals && Array.isArray(newArrivals)) {
        displayItems = newArrivals.map(p => ({
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

    // Enforce strict limit
    displayItems = displayItems.slice(0, LIMIT);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">
                        <span className="text-black">New</span> <span className="text-orange-500">Arrival</span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayItems.map((item) => (
                        item.isSkeleton ? (
                            <div key={item.id} className="group block">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-200 animate-pulse mb-4" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={item.id}
                                href={item.link}
                                className="group block"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                                    {/* Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-black/90 text-white text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                                            New
                                        </span>
                                    </div>

                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out"
                                    />

                                    {/* Overlay / Quick Action (Optional - keeping it clean for now, maybe just subtle overlay) */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-medium text-gray-900 text-base group-hover:text-blue-600 transition-colors truncate">
                                        {item.title}
                                    </h3>
                                    {item.price && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-gray-900 font-bold">
                                                ৳ {parseFloat(item.price).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}

