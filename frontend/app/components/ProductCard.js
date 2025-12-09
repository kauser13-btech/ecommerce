'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

import { Image as ImageIcon } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-[#F5F5F7] rounded-2xl overflow-hidden mb-4 border border-transparent group-hover:border-gray-200 transition-colors">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out z-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
            <ImageIcon size={40} strokeWidth={1.5} />
          </div>
        )}

        {/* New Badge */}
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide z-10">
            New
          </span>
        )}

        {/* Add to Cart Button - Visible on Hover (Desktop) / Always (Mobile) */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-black text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20 hover:bg-gray-800"
          title="Add to Cart"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div className="space-y-1 px-1">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          ৳{Number(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
