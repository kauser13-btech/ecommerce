import Image from 'next/image';
import Link from 'next/link';

export default function PinnedOffer({ offer }) {
    if (!offer) return null;

    const href = offer.url ? offer.url : (offer.product ? `/products/${offer.product.slug}` : '#');
    const isLink = !!offer.url || !!offer.product;

    const Content = (
        <div className="w-full aspect-[4/3] rounded-xl lg:rounded-2xl overflow-hidden relative flex flex-col p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 w-full h-full">
                {offer.image ? (
                    <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        quality={90}
                        className="object-cover transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                        No Image
                    </div>
                )}
            </div>
        </div>
    );

    if (isLink) {
        return <Link href={href} className="block h-full">{Content}</Link>;
    }

    return <div className="h-full">{Content}</div>;
}
