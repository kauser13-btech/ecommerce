import Image from 'next/image';
import Link from 'next/link';

export default function PinnedOffer({ offer }) {
    if (!offer) return null;

    const href = offer.product ? `/products/${offer.product.slug}` : '#';
    const isLink = !!offer.product;

    const Content = (
        <div className="h-full min-h-[280px] bg-[#0B0E14] rounded-2xl overflow-hidden relative flex flex-col p-8 hover:shadow-xl transition-all duration-300 border border-white/5 group">
            <div className="absolute inset-0 w-full h-full">
                {offer.image ? (
                    <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                        No Image
                    </div>
                )}
            </div>
            {/* Optional Overlay for Title if needed, currently just image */}
        </div>
    );

    if (isLink) {
        return <Link href={href} className="block h-full">{Content}</Link>;
    }

    return <div className="h-full">{Content}</div>;
}
