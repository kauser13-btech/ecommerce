'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ProductDetail({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    async function getSlug() {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    }
    getSlug();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log('Fetching product from:', `${apiUrl}/products/${slug}`);

        const response = await fetch(`${apiUrl}/products/${slug}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          console.error('Response not OK:', response.status, response.statusText);
          setProduct(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Product data:', data);
        setProduct(data);

        if (data.category?.slug) {
          const relatedResponse = await fetch(`${apiUrl}/products?category=${data.category.slug}&limit=4`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.data || relatedData);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Product not found</div>
        </div>
        <Footer />
      </>
    );
  }

  let images = [product.image];
  try {
    if (product.images) {
      images = typeof product.images === 'string'
        ? JSON.parse(product.images)
        : (Array.isArray(product.images) ? product.images : [product.image]);
    }
  } catch (error) {
    console.error('Error parsing images:', error);
    images = [product.image];
  }

  const features = product.features ? product.features.split('|') : [];

  let specifications = {};
  try {
    specifications = typeof product.specifications === 'string'
      ? JSON.parse(product.specifications)
      : (product.specifications || {});
  } catch (error) {
    console.error('Error parsing specifications:', error);
    specifications = {};
  }

  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    alert('Proceeding to checkout');
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-6">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-blue-600">Products</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Images */}
              <div>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-blue-600' : 'border-transparent'
                          }`}
                      >
                        {img ? (
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  {product.brand && (
                    <span className="text-sm text-gray-600">Brand: <strong>{product.brand.name || product.brand}</strong></span>
                  )}
                  <span className="text-sm text-gray-600">SKU: <strong>{product.sku}</strong></span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900">৳{Number(product.price).toLocaleString()}</span>
                  {product.original_price && product.original_price > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">৳{Number(product.original_price).toLocaleString()}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold">
                        Save ৳{(Number(product.original_price) - Number(product.price)).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">In Stock ({product.stock} available)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                {/* Quantity and Add to Cart */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-x border-gray-300 py-2"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Features */}
                {features.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(specifications).length > 0 && (
              <div className="mt-8 border-t pt-8">
                <h3 className="font-semibold text-xl mb-4">Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b border-gray-200 py-3">
                      <span className="w-1/3 font-medium text-gray-700">{key}</span>
                      <span className="w-2/3 text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
