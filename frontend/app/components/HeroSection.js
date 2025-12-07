import HeroSlider from './HeroSlider';
import PinnedProduct from './PinnedProduct';

export default function HeroSection({ products }) {
    if (!products || products.length === 0) return null;

    // Split products: First 3-4 for slider, next 2 for pinned
    const sliderProducts = products.slice(0, 4);
    const pinnedProducts = products.slice(4, 6);

    return (
        <section className="w-full pt-36 pb-12 bg-black">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Stacked Cards (Takes 1 column on desktop) */}
                <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                    {pinnedProducts.map((product) => (
                        <div key={product.id} className="flex-1">
                            <PinnedProduct product={product} />
                        </div>
                    ))}
                    {/* Fallback if not enough products */}
                    {pinnedProducts.length < 2 && (
                        <div className="flex-1 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
                            {/* Empty State */}
                        </div>
                    )}
                </div>

                {/* Right: Hero Slider (Takes 2 columns on desktop) */}
                <div className="lg:col-span-2 h-full">
                    <HeroSlider products={sliderProducts} />
                </div>
            </div>
        </section>
    );
}
