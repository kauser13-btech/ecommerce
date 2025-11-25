import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
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

export default async function Home() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals()
  ]);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main>
        <HeroSection />

        <CategoryGrid />

        {/* New Arrivals Slider Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              The Latest. <span className="text-gray-500">Take a look at what’s new.</span>
            </h2>
            <a href="/products?filter=new" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
              See all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section className="bg-[#F5F5F7] py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold text-gray-900">
                Featured. <span className="text-gray-500">Top picks for you.</span>
              </h2>
              <a href="/products?filter=featured" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                See all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
