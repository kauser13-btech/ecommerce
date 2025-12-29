'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-200 animate-pulse mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}

export default function ProductCard({ product, isSkeleton = false }) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(null);

  if (isSkeleton) return <ProductCardSkeleton />;
  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Determine main image
  const mainImage = product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.png');

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-4">
        {/* Badges Container */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 items-start">
          {product.is_new && (
            <span className="bg-black/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm">
              New
            </span>
          )}
          {product.is_preorder && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm">
              Pre-Order
            </span>
          )}
        </div>

        {/* Badge: Sale (if original price > price) */}
        {product.original_price > product.price && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              - {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
            </span>
          </div>
        )}

        <Image
          src={activeImage || mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={false}
        />

        {/* Overlay with Add to Cart */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <button
          onClick={handleAddToCart}
          disabled={!product.is_preorder && product.stock <= 0}
          className="absolute bottom-3 right-3 bg-white text-black p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          title={product.is_preorder ? "Pre-Order" : (product.stock <= 0 ? "Out of Stock" : "Add to Cart")}
        >
          <ShoppingCart size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 text-base group-hover:text-blue-600 transition-colors truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-gray-900 font-bold">
            ৳ {Number(product.price).toLocaleString()}
          </p>
          {product.original_price > product.price && (
            <p className="text-gray-400 text-sm line-through decoration-gray-400/50">
              ৳ {Number(product.original_price).toLocaleString()}
            </p>
          )}
        </div>

        {/* Product Colors */}
        {(() => {
          try {
            const colors = typeof product.product_colors === 'string'
              ? JSON.parse(product.product_colors)
              : product.product_colors;

            if (Array.isArray(colors) && colors.length > 0) {
              return (
                <div className="flex flex-wrap gap-1.5 pt-1" onClick={(e) => e.preventDefault()}>
                  {colors.slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-200 overflow-hidden relative cursor-pointer hover:scale-110 transition-transform hover:border-gray-400"
                      title={color.name}
                      onMouseEnter={() => {
                        if (color.image) setActiveImage(color.image);
                      }}
                      onMouseLeave={() => setActiveImage(null)}
                      style={{ backgroundColor: color.code || undefined }}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: color.code || undefined }} />
                    </div>
                  ))}
                  {colors.length > 5 && (
                    <span className="text-[10px] text-gray-400 flex items-center">+{colors.length - 5}</span>
                  )}
                </div>
              );
            }
          } catch (e) {
            return null;
          }
        })()}
      </div>
    </Link>
  );
}
