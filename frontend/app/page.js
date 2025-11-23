import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';

// Fetch data on server-side
async function getFeaturedProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/products/featured`, {
      cache: 'no-store'
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getNewArrivals() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/products/new-arrivals`, {
      cache: 'no-store'
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

async function getBrands() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/brands`, {
      cache: 'no-store'
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function Home() {
  const [featuredProducts, newArrivals, brands] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBrands()
  ]);

  return (
    <>
      <Header />

      <main>
        {/* Hero Banners */}
        <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  iPhone 15 Pro Max
                </h1>
                <p className="text-xl mb-6">
                  Now available with up to 36 months EMI
                </p>
                <div className="flex gap-4">
                  <a
                    href="/products/iphone-15-pro-max"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Shop Now
                  </a>
                  <a
                    href="/pre-order"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                  >
                    Pre-order
                  </a>
                </div>
              </div>
              <div className="relative h-64 md:h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-6xl">📱</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-semibold text-sm mb-1">Fast Delivery</h3>
                <p className="text-xs text-gray-600">Same day shipping</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">💳</div>
                <h3 className="font-semibold text-sm mb-1">36 Months EMI</h3>
                <p className="text-xs text-gray-600">0% interest available</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="font-semibold text-sm mb-1">Easy Exchange</h3>
                <p className="text-xs text-gray-600">7 days return policy</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-semibold text-sm mb-1">Warranty</h3>
                <p className="text-xs text-gray-600">Official warranty</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <a href="/products?filter=featured" className="text-blue-600 hover:underline font-medium">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
              <a href="/products?filter=new" className="text-blue-600 hover:underline font-medium">
                View All →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Brand */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Brand</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {brands.slice(0, 6).map((brand) => (
              <a
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-lg font-semibold text-gray-800">{brand.name}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-linear-to-r from-orange-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Special Offer!
              </h2>
              <p className="text-lg mb-6">
                Get up to 20% off on selected products. Limited time offer!
              </p>
              <a
                href="/offers"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Shop Offers
              </a>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Mobile Phones', icon: '📱', slug: 'mobile-phones' },
                { name: 'Laptops', icon: '💻', slug: 'laptops' },
                { name: 'Tablets', icon: '📱', slug: 'tablets' },
                { name: 'Smartwatches', icon: '⌚', slug: 'smartwatches' },
                { name: 'Earbuds', icon: '🎧', slug: 'earbuds' },
                { name: 'Accessories', icon: '🔌', slug: 'accessories' },
                { name: 'Gaming', icon: '🎮', slug: 'gaming' },
                { name: 'Smart Home', icon: '🏠', slug: 'smart-home' },
              ].map((category) => (
                <a
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
