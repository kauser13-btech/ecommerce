import Header from './components/Header';
import Footer from './components/Footer';
import ShopByCategories from './components/ShopByCategories';
import ProductCard from './components/ProductCard';
import HeroSection from './components/HeroSection';
import NewArrivalsGrid from './components/NewArrivalsGrid';

// Fetch data on server-side
export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/new-arrivals`, {
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

      <main className="pt-32">
        <HeroSection products={newArrivals} />

        <NewArrivalsGrid />

        {/* <ShopByCategories /> */}

      </main>

      <Footer />
    </div>
  );
}
