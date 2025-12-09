import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import NewArrivalsGrid from './components/NewArrivalsGrid';

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

export default async function Home() {
  const [offers, newArrivals] = await Promise.all([
    getOffers(),
    getNewArrivals()
  ]);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-32">
        <HeroSection offers={offers} />

        <NewArrivalsGrid />

      </main>

      <Footer />
    </div>
  );
}
