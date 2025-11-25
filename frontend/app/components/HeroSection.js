import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="bg-[#F5F5F7] pt-32 pb-20 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-5xl md:text-7xl font-semibold text-gray-900 mb-4 tracking-tight">
                    iPhone 15 Pro
                </h2>
                <p className="text-2xl md:text-3xl text-gray-500 mb-8 font-light">
                    Titanium. So strong. So light. So Pro.
                </p>
                <div className="flex items-center justify-center gap-6 mb-16">
                    <Link
                        href="/products/iphone-15-pro"
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                        Buy
                    </Link>
                    <Link
                        href="/products/iphone-15-pro"
                        className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                    >
                        Learn more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Hero Image Placeholder */}
                <div className="relative h-[400px] md:h-[600px] w-full max-w-5xl mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-gray-200 to-transparent rounded-t-3xl">
                        <span className="text-6xl">📱</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
