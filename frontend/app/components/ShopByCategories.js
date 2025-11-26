import Link from 'next/link';

export default function ShopByCategories() {
    const categories = [
        { name: 'Mobile Phone', slug: 'mobile-phone', icon: '📱' },
        { name: 'Tablet', slug: 'tablet', icon: '📟' },
        { name: 'Laptop', slug: 'laptop', icon: '💻' },
        { name: 'Airpods', slug: 'airpods', icon: '🎧' },
        { name: 'Wireless Headphones', slug: 'wireless-headphones', icon: '🎧' },
        { name: 'Headphones', slug: 'headphones', icon: '🎧' },
        { name: 'Speakers', slug: 'speakers', icon: '🔊' },
        { name: 'Starlink', slug: 'starlink', icon: '📡' },
        { name: 'Smartwatch', slug: 'smartwatch', icon: '⌚' },
        { name: 'Smart Pen', slug: 'smart-pen', icon: '🖊️' },
        { name: 'Power Adapter', slug: 'power-adapter', icon: '🔌' },
        { name: 'Cables', slug: 'cables', icon: '➰' },
        { name: 'Power Bank', slug: 'power-bank', icon: '🔋' },
        { name: 'Wireless Charger', slug: 'wireless-charger', icon: '⚡' },
    ];

    return (
        <div className="bg-[url('/orange-bg.png')]  bg-center bg-repeat-x w-full">

            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="relative rounded-[3rem] overflow-hidden p-8 md:p-12 shadow-2xl border border-white/40">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl"></div>
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
                            Shop by <span className="text-[#FF512F]">Categories</span>
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/products?category=${category.slug}`}
                                    className="group flex flex-col items-center gap-3"
                                >
                                    <div className="w-full aspect-square bg-[#FFE8D6] rounded-2xl flex flex-col items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            {category.icon}
                                        </div>
                                        <span className="text-xs mt-2 font-medium text-gray-800 text-center leading-tight">
                                            {category.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
