'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
    {
        id: 1,
        title: 'iPhone',
        image: 'https://images.unsplash.com/photo-1696446702375-908bc27dbcd6?auto=format&fit=crop&q=80&w=500', // iPhone 15/16 lookalike
        link: '/products?category=iphone'
    },
    {
        id: 2,
        title: 'Macbook',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=500', // Macbook
        link: '/products?category=macbook'
    },
    {
        id: 3,
        title: 'iPad',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=500', // iPad
        link: '/products?category=ipad'
    },
    {
        id: 4,
        title: 'Apple Watch',
        image: 'https://images.unsplash.com/photo-1434493789847-2f02ea6ca920?auto=format&fit=crop&q=80&w=500', // Apple Watch
        link: '/products?category=watch'
    },
    {
        id: 5,
        title: 'Mac Mini',
        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=500', // Mac Mini ish
        link: '/products?category=mac-mini'
    },
    {
        id: 6,
        title: 'iMac',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=500', // iMac
        link: '/products?category=imac'
    },
    {
        id: 7,
        title: 'Android Smartphones',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=500', // Samsung/Android
        link: '/products?category=android-phone'
    },
    {
        id: 8,
        title: 'Android Tablets',
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=500', // Android Tablet
        link: '/products?category=android-tablet'
    }
];

export default function NewArrivalsGrid() {
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
                    {categories.map((item) => (
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
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="text-center p-2">
                                <h3 className="font-semibold text-gray-700 text-lg group-hover:text-black transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
