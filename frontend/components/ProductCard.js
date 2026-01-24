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
    <div className="group block border border-gray-200 rounded-2xl overflow-hidden">
      {/* Image placeholder with matching aspect ratio and rounded corners */}
      <div className="relative aspect-[1] overflow-hidden rounded-t-2xl bg-gray-200 animate-pulse" />
      {/* Content area placeholder with matching padding and background */}
      <div className="space-y-2 p-4 bg-gray-50">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" /> {/* Placeholder for product title */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" /> {/* Placeholder for product price */}
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
          <div className="flex flex-wrap gap-1.5 pt-1 absolute bottom-3 left-3" onClick={(e) => e.preventDefault()}>
            {colors.slice(0, 5).map((color) => (
              <div
                key={color.code || color.name} // Use a unique identifier for the key
                className="w-4 h-4 rounded-full border border-gray-200 overflow-hidden relative cursor-pointer hover:scale-110 transition-transform hover:border-gray-400"
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
            {colors.length > 5 && (
              <span className="text-[10px] text-gray-400 flex items-center">+{colors.length - 5}</span>
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
    <Link href={`/products/${product.slug}`} className="group block border border-gray-200 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {/* Product Image Container */}
      <div className="relative aspect-[1] overflow-hidden rounded-t-2xl">
        {/* Badges for New, Pre-Order, and Sale */}
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

        {isOnSale && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              - {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
            </span>
          </div>
        )}

        <Image
          src={activeImage || mainImageUrl} // Show color-specific image on hover, otherwise main image
          alt={product.name}
          fill
          className="object-contain transition-opacity duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Subtle overlay on hover for visual depth */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Color Swatches */}
        {renderColorSwatches()}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.is_preorder && product.stock <= 0}
          className="absolute bottom-3 right-3 bg-white text-black p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          title={product.is_preorder ? "Pre-Order" : (product.stock <= 0 ? "Out of Stock" : "Add to Cart")}
          aria-label={product.is_preorder ? "Pre-Order this item" : (product.stock <= 0 ? "This item is out of stock" : "Add this item to your cart")}
        >
          <ShoppingCart size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Product Information */}
      <div className="space-y-2 p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          {product.is_preorder ? (
            <p className="text-gray-900 font-bold">TBD</p>
          ) : (
            <>
              <p className="text-gray-900 font-bold">
                ৳ {isNaN(currentPrice) ? 'N/A' : currentPrice.toLocaleString()}
              </p>
              {isOnSale && (
                <p className="text-gray-400 text-sm line-through decoration-gray-400/50">
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