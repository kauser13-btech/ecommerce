'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import AppleLogo from '@/assets/icons/apple-logo.svg';
import WhatsappIcon from '@/assets/icons/whatsapp.svg';

export default function ProductDetail({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);

  // Mock Selectors State
  const [selectedColor, setSelectedColor] = useState('Cosmic Orange');
  const [selectedRegion, setSelectedRegion] = useState('E-Sim USA');
  const [selectedStorage, setSelectedStorage] = useState('256GB');

  const { addToCart } = useCart();

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
        const response = await fetch(`${apiUrl}/products/${slug}`);

        if (!response.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
          <div className="text-xl font-semibold">Product not found</div>
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
    images = [product.image];
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    window.location.href = '/cart';
  };

  // Mock Options
  const colors = [
    { name: 'Cosmic Orange', hex: '#E86C24' },
    { name: 'Deep Blue', hex: '#2E3A59' },
    { name: 'Silver', hex: '#E3E4E5' },
  ];
  const regions = ['E-Sim UAE', 'E-Sim USA', 'SIM+eSim HK/AUS'];
  const storages = ['1TB', '2TB', '256GB', '512GB'];

  const discountAmount = product.original_price ? product.original_price - product.price : 0;
  const discountPercent = product.original_price ? Math.round((discountAmount / product.original_price) * 100) : 0;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Images */}
              <div className="space-y-6">
                <div className="aspect-[4/3] bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center relative overflow-hidden">
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-20 flex-shrink-0 bg-white rounded-xl border-2 p-2 ${selectedImage === idx ? 'border-orange-500' : 'border-gray-100 hover:border-gray-300'
                          } transition-colors`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <AppleLogo className="w-5 h-5" />
                    <span>Apple</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

                  <div className="flex items-center flex-wrap gap-4">
                    <span className="text-3xl font-bold text-gray-900">৳ {Number(product.price).toLocaleString()}</span>
                    {discountPercent > 0 && (
                      <span className="bg-[#ccfccb] text-[#0f5132] px-3 py-1 rounded-full text-sm font-bold">
                        {discountPercent}% off
                      </span>
                    )}
                    {product.original_price > product.price && (
                      <span className="text-gray-400 line-through text-lg">৳{Number(product.original_price).toLocaleString()}</span>
                    )}

                    {product.stock > 0 ? (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold">In Stock</span>
                    ) : (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">Out of Stock</span>
                    )}

                    <span className="text-gray-500 text-sm ml-auto">Code: <span className="text-gray-900 font-medium">{product.sku || 'N/A'}</span></span>
                  </div>
                </div>

                {/* Selectors */}
                <div className="space-y-6">
                  {/* Color */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${selectedColor === color.name
                            ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium ring-1 ring-orange-500'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }}></span>
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Region and Storage Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Storage */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Storage</h3>
                      <div className="flex flex-wrap gap-2">
                        {storages.map((storage) => (
                          <button
                            key={storage}
                            onClick={() => setSelectedStorage(storage)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedStorage === storage
                              ? 'border-orange-500 text-orange-600 ring-1 ring-orange-500'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                          >
                            {storage}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Region */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Region</h3>
                      <div className="flex flex-wrap gap-2">
                        {regions.map((region) => (
                          <button
                            key={region}
                            onClick={() => setSelectedRegion(region)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedRegion === region
                              ? 'border-orange-500 text-orange-600 ring-1 ring-orange-500'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Boxes */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#e8fce8] p-4 rounded-xl flex items-center gap-3 text-sm text-gray-800">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    1 Year Official Warranty Support Except USA Variant
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#fff4e5] p-4 rounded-xl flex items-center gap-2 text-sm text-gray-800">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div>
                        <span className="block font-semibold">EMI Available</span>
                        <span className="text-orange-600 underline cursor-pointer">View Plans</span>
                      </div>
                    </div>
                    <button className="bg-[#e8fce8] p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-green-800 hover:bg-[#dcfcda] transition">
                      <WhatsappIcon className="w-5 h-5" />
                      Whatsapp
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Select Quantity</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black font-bold text-lg">-</button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black font-bold text-lg">+</button>
                    </div>

                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Buy Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="px-8 py-3 rounded-full border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Info</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
