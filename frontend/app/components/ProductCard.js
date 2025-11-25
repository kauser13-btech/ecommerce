import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-[#F5F5F7] rounded-2xl overflow-hidden mb-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {product.is_new && (
          <span className="absolute top-4 left-4 text-[10px] font-semibold text-orange-500 uppercase tracking-wide">
            New
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">
          ৳{Number(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
