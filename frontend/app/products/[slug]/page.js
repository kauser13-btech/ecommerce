'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ImageLightbox from '@/components/ImageLightbox';
import { Maximize2, ChevronRight, Home, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

export default function ProductDetail({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [parsedOptions, setParsedOptions] = useState([]);

  const { addToCart, toggleCart } = useCart();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [zoomOrigin, setZoomOrigin] = useState('center center');

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setZoomOrigin('center center');
  };

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
    fetchProduct();
  }, [slug]);

  // ... existing code ...
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (product?.options) {
      try {
        const opts = typeof product.options === 'string' ? JSON.parse(product.options) : product.options;
        setParsedOptions(opts);
        const initial = {};
        opts.forEach(opt => {
          if (opt.values && opt.values.length > 0) initial[opt.name] = opt.values[0];
        });
        setSelectedOptions(initial);
      } catch (e) {
        console.error('Error parsing parsedOptions:', e);
        setParsedOptions([]);
      }
    }

    if (product?.specifications) {
      setActiveTab('specifications');
    } else if (product?.description) {
      setActiveTab('description');
    }
  }, [product]);

  // Find matching variant
  useEffect(() => {
    if (!product?.variants || !selectedOptions) {
      setSelectedVariant(null);
      return;
    }

    const variant = product.variants.find(v => {
      try {
        const vAttrs = typeof v.attributes === 'string' ? JSON.parse(v.attributes) : v.attributes;
        // Check if every selected option matches this variant's attributes
        return Object.entries(selectedOptions).every(([key, value]) => vAttrs[key] === value);
      } catch (e) {
        return false;
      }
    });

    setSelectedVariant(variant || null);
  }, [product, selectedOptions]);

  const rawImages = useMemo(() => {
    if (!product) return [];
    let imgs = [product.image];
    try {
      if (product.images) {
        imgs = typeof product.images === 'string'
          ? JSON.parse(product.images)
          : (Array.isArray(product.images) ? product.images : [product.image]);
      }
    } catch (error) {
      imgs = [product.image];
    }
    return imgs.filter(Boolean);
  }, [product]);

  const images = useMemo(() => {
    const variantImages = product?.variants?.map(v => v.image).filter(Boolean) || [];
    const uniqueVariantImages = variantImages.filter(img => !rawImages.includes(img));

    // Combine rawImages + uniqueVariantImages
    // We also want to ensure uniqueness within variantImages themselves if multiple variants use same image
    const seen = new Set(rawImages);
    const finalImages = [...rawImages];

    variantImages.forEach(img => {
      if (!seen.has(img)) {
        seen.add(img);
        finalImages.push(img);
      }
    });

    return finalImages;
  }, [product, rawImages]);

  // Reset selected image when slug changes
  useEffect(() => {
    setSelectedImage(0);
  }, [slug]);

  // Auto-switch image when variant selected
  useEffect(() => {
    if (selectedVariant?.image) {
      const idx = images.indexOf(selectedVariant.image);
      if (idx !== -1) setSelectedImage(idx);
    }
  }, [selectedVariant, images]);


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



  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: selectedVariant ? selectedVariant.id : product.id, // Use variant ID if selected? Or keep product ID and add variant_id? Usually Cart item needs unique ID.
      variant_id: selectedVariant?.id,
      price: selectedVariant ? selectedVariant.price : product.price,
      image: selectedVariant?.image || product.image,
      sku: selectedVariant?.sku || product.sku,
      quantity,
      selectedOptions
    });
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      id: selectedVariant ? selectedVariant.id : product.id,
      variant_id: selectedVariant?.id,
      price: selectedVariant ? selectedVariant.price : product.price,
      image: selectedVariant?.image || product.image,
      sku: selectedVariant?.sku || product.sku,
      quantity,
      selectedOptions
    });
    toggleCart();
  };





  // Determine current price and original price based on selection
  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const currentOriginalPrice = selectedVariant ? (selectedVariant.original_price ? Number(selectedVariant.original_price) : 0) : (product.original_price ? Number(product.original_price) : 0);

  const discountAmount = currentOriginalPrice > currentPrice ? currentOriginalPrice - currentPrice : 0;
  const discountPercent = currentOriginalPrice > currentPrice ? Math.round((discountAmount / currentOriginalPrice) * 100) : 0;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-40 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-orange-500 transition-colors flex items-center gap-1">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />

            {product.category && (
              <>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-orange-500 transition-colors"
                >
                  {product.category.name}
                </Link>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </>
            )}

            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>

          {/* Main Product */}
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Images */}
              <div className="space-y-6">
                <div
                  className="aspect-[1] bg-white rounded-2xl border border-gray-100 flex items-center justify-center relative overflow-hidden cursor-zoom-in group"
                  onClick={() => setIsLightboxOpen(true)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[2]"
                      style={{ transformOrigin: zoomOrigin }}
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                  {/* Zoom Hint Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-end p-4 opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 backdrop-blur text-gray-800 p-2.5 rounded-full shadow-sm hover:scale-110 transition-transform">
                      <Maximize2 size={20} />
                    </span>
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-20 flex-shrink-0 bg-white overflow-hidden rounded-xl border-2 ${selectedImage === idx ? 'border-orange-500' : 'border-gray-100 hover:border-gray-300'
                          } transition-colors`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
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
                    {product.brand?.logo && (
                      <img src={product.brand.logo} alt={product.brand.name} className="w-6 h-6 object-contain" />
                    )}
                    <span>{product.brand?.name}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                  <div className="text-gray-500 text-xs ml-auto">Code: <span className="text-gray-900 font-medium">{selectedVariant ? selectedVariant.sku : (product.sku || 'N/A')}</span></div>

                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ৳ {currentPrice.toLocaleString()}
                    </span>
                    {discountPercent > 0 && (
                      <span className="bg-[#ccfccb] text-[#0f5132] px-3 py-1 rounded-full text-sm font-bold">
                        {discountPercent}% off
                      </span>
                    )}
                    {currentOriginalPrice > currentPrice && (
                      <span className="text-gray-400 line-through text-lg">৳{currentOriginalPrice.toLocaleString()}</span>
                    )}

                    {(selectedVariant ? selectedVariant.stock : product.stock) <= 0 && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Selectors */}
                {/* Dynamic Options */}
                <div className="space-y-4">
                  {parsedOptions.map((option, idx) => (
                    <div key={idx}>
                      <h3 className="font-bold text-gray-900 mb-3">{option.name}</h3>
                      <div className="flex flex-wrap gap-3">
                        {option.values.map((val) => (
                          <button
                            key={val}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                            className={`px-4 py-2 rounded-xl border transition-all ${selectedOptions[option.name] === val
                              ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium ring-1 ring-orange-500'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Select Quantity</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black font-bold text-lg disabled:opacity-50"
                        disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}
                      >-</button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black font-bold text-lg disabled:opacity-50"
                        disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}
                      >+</button>
                    </div>

                    <button
                      onClick={handleBuyNow}
                      disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                    >
                      {(selectedVariant ? selectedVariant.stock : product.stock) <= 0 ? 'Out of Stock' : 'Buy Now'}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}
                      className="px-8 py-3 rounded-full border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Part */}
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {/* Details Section */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                {(() => {
                  const tabs = [
                    { id: 'description', label: 'Details', content: product.description },
                    { id: 'specifications', label: 'Specifications', content: product.specifications },
                    { id: 'features', label: 'Features', content: product.features },
                  ].filter(tab => tab.content);

                  if (tabs.length === 0) return null;

                  // Ensure active tab is valid
                  const currentTab = tabs.find(t => t.id === activeTab) ? activeTab : tabs[0].id;

                  return (
                    <div>
                      <div className="flex flex-wrap gap-8 border-b border-gray-100 mb-8">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-lg font-bold border-b-2 transition-colors relative ${currentTab === tab.id
                              ? 'text-orange-500 border-orange-500'
                              : 'text-gray-400 border-transparent hover:text-gray-600'
                              }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="prose prose-stone max-w-none">
                        {(() => {
                          const tab = tabs.find(t => t.id === currentTab);
                          if (!tab) return null;

                          if (tab.id === 'specifications') {
                            try {
                              const specs = typeof tab.content === 'string' ? JSON.parse(tab.content) : tab.content;

                              // Handle Key-Value Object
                              if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
                                return (
                                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <tbody className="divide-y divide-gray-200 bg-white">
                                        {Object.entries(specs).map(([key, value], idx) => (
                                          <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 w-1/3">{key}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{value}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                );
                              }
                              // Handle Array of Objects (if applicable, e.g. [{name: 'Weight', value: '1kg'}])
                              if (Array.isArray(specs)) {
                                return (
                                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <tbody className="divide-y divide-gray-200 bg-white">
                                        {specs.map((item, idx) => {
                                          const key = item.name || item.key || item.label || Object.keys(item)[0];
                                          const value = item.value || item.content || Object.values(item)[0];
                                          return (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                              <td className="px-6 py-4 text-sm font-semibold text-gray-900 w-1/3">{key}</td>
                                              <td className="px-6 py-4 text-sm text-gray-600">{value}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                );
                              }
                            } catch (e) {
                              console.log('Failed to parse specifications JSON', e);
                            }
                          }

                          const proseClasses = `
                            prose prose-stone max-w-none 
                            prose-p:my-2 
                            prose-headings:font-bold 
                            prose-a:text-blue-600 hover:prose-a:text-blue-500 
                            prose-ul:list-disc prose-ul:pl-5 
                            prose-ol:list-decimal prose-ol:pl-5 
                            prose-li:marker:text-orange-500
                            prose-li:my-1
                            [&_.ql-ui]:hidden
                            [&_ol>li[data-list='bullet']]:list-disc
                            [&_ol>li[data-list='bullet']]:marker:text-orange-500
                          `;

                          if (tab.id === 'features') {
                            return <div className={proseClasses} dangerouslySetInnerHTML={{ __html: tab.content }} />;
                          }

                          return <div className={proseClasses} dangerouslySetInnerHTML={{ __html: tab.content }} />;
                        })()}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="lg:col-span-1">
              {relatedProducts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                  <div className="relative group">
                    <Swiper
                      modules={[Autoplay, Navigation]}
                      spaceBetween={20}
                      slidesPerView={1.2}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                      }}
                      navigation={{
                        prevEl: '.custom-swiper-button-prev',
                        nextEl: '.custom-swiper-button-next',
                      }}
                      breakpoints={{
                        640: {
                          slidesPerView: 2.2,
                        },
                        1024: {
                          slidesPerView: 1,
                        }
                      }}
                      className="related-products-slider"
                    >
                      {relatedProducts.slice(0, 6).map((relatedProduct) => (
                        <SwiperSlide key={relatedProduct.id}>
                          <div className="h-full">
                            <ProductCard product={relatedProduct} />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Custom Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <button className="custom-swiper-button-prev w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeft size={20} />
                      </button>
                      <button className="custom-swiper-button-next w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      <ImageLightbox
        images={images}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={selectedImage}
      />

      <Footer />
    </>
  );
}
