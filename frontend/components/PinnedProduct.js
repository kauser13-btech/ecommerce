import Image from 'next/image';
import Link from 'next/link';

export default function PinnedProduct({ product }) {
    if (!product) return null;

    return (
        <Link href={`/products/${product.slug}`} className="group block h-full">
            <div className="h-full min-h-[280px] bg-[#0B0E14] rounded-2xl overflow-hidden relative flex flex-col p-8 hover:shadow-xl transition-all duration-300 border border-white/5">

                {/* Image - Full Cover */}
                <div className="absolute inset-0 w-full h-full">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                            No Image
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
