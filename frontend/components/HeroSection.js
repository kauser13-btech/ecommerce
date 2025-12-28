import HeroSlider from './HeroSlider';
import PinnedOffer from './PinnedOffer';

export default function HeroSection({ offers }) {
    if (!offers || offers.length === 0) return null;

    // Limit to 10 active offers
    const activeOffers = offers.slice(0, 10);

    // Split offers: First 2 for pinned, Rest (up to 8) for slider
    const pinnedOffers = activeOffers.slice(0, 2);
    const sliderOffers = activeOffers.slice(2);

    return (
        <section className="w-full pt-12 pb-12 bg-black">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Stacked Pinned Offers (Takes 1 column on desktop) */}
                <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                    {pinnedOffers.map((offer) => (
                        <div key={offer.id} className="flex-1">
                            <PinnedOffer offer={offer} />
                        </div>
                    ))}
                    {/* Fallback layout preservation if only 1 pinned offer */}
                    {pinnedOffers.length === 1 && (
                        <div className="flex-1 hidden lg:block"></div>
                    )}
                </div>

                {/* Right: Hero Slider (Takes 2 columns on desktop) */}
                <div className="lg:col-span-2 h-full">
                    {sliderOffers.length > 0 ? (
                        <HeroSlider offers={sliderOffers} />
                    ) : (
                        // If no slider offers, maybe expand pinned or show placeholder?
                        <div className="h-full w-full min-h-[600px] bg-[#0B0E14] rounded-2xl flex items-center justify-center text-gray-500">
                            No more offers
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
