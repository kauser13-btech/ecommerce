import Link from 'next/link';

export default function CategoryGrid() {
    const categories = [
        { name: 'Mac', icon: '💻', slug: 'mac', color: 'bg-gray-100' },
        { name: 'iPad', icon: '🖊️', slug: 'ipad', color: 'bg-gray-50' },
        { name: 'Watch', icon: '⌚', slug: 'watch', color: 'bg-gray-900 text-white' },
        { name: 'AirPods', icon: '🎧', slug: 'airpods', color: 'bg-white border border-gray-200' },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-12 text-center">
                Store. The best way to buy the products you love.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        className={`${category.color} rounded-3xl p-8 h-80 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}
                    >
                        <div>
                            <h3 className={`text-2xl font-semibold ${category.slug === 'watch' ? 'text-white' : 'text-gray-900'}`}>
                                {category.name}
                            </h3>
                        </div>
                        <div className="self-end text-6xl">
                            {category.icon}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
