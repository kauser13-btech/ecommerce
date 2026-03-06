'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

/**
 * Skeleton component for the ProductCard.
 * Provides a visual placeholder while the actual product data is loading.
 * The dimensions and styling are designed to closely match the final ProductCard
 * to minimize layout shift and provide a smoother loading experience.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full border border-gray-100/80 rounded-2xl overflow-hidden bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
      <div className="relative aspect-square overflow-hidden bg-gray-50 animate-pulse" />
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2.5">
        <div className="h-3 sm:h-4 bg-gray-100 rounded-md animate-pulse w-3/4" />
        <div className="h-4 sm:h-5 bg-gray-100 rounded-md animate-pulse w-1/3 mt-auto" />
      </div>
    </div>
  );
}

export default function ProductCard({ product, isSkeleton = false }) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(null);

  // Render skeleton if requested or if product data is not yet available
  if (isSkeleton) return <ProductCardSkeleton />;
  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents the Link component from navigating
    e.stopPropagation(); // Prevents event bubbling
    addToCart(product);
  };

  // --- Data Preparation and Robustness ---
  // Ensure prices are numbers before formatting to avoid "NaN" display
  const currentPrice = Number(product.price);
  const originalPrice = Number(product.original_price);
  const isOnSale = originalPrice > currentPrice && !isNaN(currentPrice) && !isNaN(originalPrice);

  // Determine the main product image URL, with a fallback to a placeholder
  const mainImageUrl = product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.png');

  // --- Extracted Rendering Logic for Readability ---
  /**
   * Renders the color swatches for the product.
   * Parses the product_colors data and handles potential errors.
   */
  const renderColorSwatches = () => {
    try {
      // Handle cases where product_colors might be a JSON string or already an object/array
      const colors = typeof product.product_colors === 'string'
        ? JSON.parse(product.product_colors)
        : product.product_colors;

      if (Array.isArray(colors) && colors.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 md:gap-1.5 absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20" onClick={(e) => e.preventDefault()}>
            {colors.slice(0, 4).map((color, idx) => (
              <div
                key={`${color.code || color.name}-${idx}`} // Fix duplicate key error
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-gray-200/60 overflow-hidden relative cursor-pointer hover:scale-110 transition-transform hover:border-gray-400 shadow-sm"
                title={color.name}
                onMouseEnter={() => {
                  if (color.image) setActiveImage(color.image); // Set active image on hover
                }}
                onMouseLeave={() => setActiveImage(null)} // Reset active image when hover ends
                style={{ backgroundColor: color.code || undefined }}
              >
                <div className="w-full h-full" style={{ backgroundColor: color.code || undefined }} />
              </div>
            ))}
            {colors.length > 4 && (
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/60 flex items-center justify-center shadow-sm">
                <span className="text-[8px] sm:text-[9px] font-medium text-gray-600">+{colors.length - 4}</span>
              </div>
            )}
          </div>
        );
      }
    } catch (error) {
      // console.error("Failed to parse product_colors for product:", product.name, error);
      return null; // Gracefully fallback if color data is malformed
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-gray-200"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50/50">
        {/* Badges for New, Pre-Order, and Sale */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.is_new && (
            <span className="bg-black/90 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm">
              New
            </span>
          )}
          {product.is_preorder && (
            <span className="bg-purple-600/90 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm">
              Pre-Order
            </span>
          )}
        </div>

        {isOnSale && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex flex-col items-end">
            <span className="bg-red-500/90 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm">
              - {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
            </span>
          </div>
        )}

        <Image
          src={activeImage || mainImageUrl} // Show color-specific image on hover, otherwise main image
          alt={product.name}
          fill
          className="object-contain p-2 sm:p-0 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Subtle overlay on hover for visual depth */}
        <div className="absolute inset-0 bg-black/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Color Swatches */}
        {renderColorSwatches()}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.is_preorder && product.stock <= 0}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/95 backdrop-blur-sm text-black p-2 sm:p-2.5 rounded-full shadow-sm sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-4 sm:group-hover:translate-y-0 translate-y-0 opacity-100 transition-all duration-300 z-20 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          title={product.is_preorder ? "Pre-Order" : (product.stock <= 0 ? "Out of Stock" : "Add to Cart")}
          aria-label={product.is_preorder ? "Pre-Order this item" : (product.stock <= 0 ? "This item is out of stock" : "Add this item to your cart")}
        >
          <ShoppingCart size={16} strokeWidth={2.5} className="sm:hidden" />
          <ShoppingCart size={18} strokeWidth={2} className="hidden sm:block" />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 bg-white gap-1.5 sm:gap-2">
        <h3 className="font-medium text-gray-900 text-[13px] sm:text-[15px] group-hover:text-blue-600 transition-colors line-clamp-2 leading-[1.3] tracking-tight">
          {product.name}
        </h3>

        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-auto pt-0.5">
          {product.is_preorder ? (
            <p className="text-gray-900 font-bold text-sm sm:text-base">TBD</p>
          ) : (
            <>
              <p className="text-gray-900 font-bold text-sm sm:text-base">
                ৳ {isNaN(currentPrice) ? 'N/A' : currentPrice.toLocaleString()}
              </p>
              {isOnSale && (
                <p className="text-gray-400 text-[11px] sm:text-[13px] line-through decoration-gray-400/60 font-medium">
                  ৳ {originalPrice.toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}