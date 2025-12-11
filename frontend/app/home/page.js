import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import NewArrivalsGrid from '../components/NewArrivalsGrid';
import FeaturedProductGrid from '../components/FeaturedProductGrid';

// Fetch data on server-side
export const dynamic = 'force-dynamic';

async function getOffers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers?active_only=true`, {
      cache: 'no-store'
    });
    const offers = await response.json();
    return offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
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

export default async function Home() {
  const [offers, newArrivals, featuredProducts] = await Promise.all([
    getOffers(),
    getNewArrivals(),
    getFeaturedProducts()
  ]);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-28">
        <HeroSection offers={offers} />

        <FeaturedProductGrid featuredProducts={featuredProducts} />

        <NewArrivalsGrid newArrivals={newArrivals} />

      </main>

      <Footer />
    </div>
  );
}
