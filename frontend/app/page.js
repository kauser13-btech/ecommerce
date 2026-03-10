import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ShopByCategories from '@/components/ShopByCategories';
import ShopByBrands from '@/components/ShopByBrands';
import NewArrivalsGrid from '@/components/NewArrivalsGrid';
import FeaturedProductGrid from '@/components/FeaturedProductGrid';
import FeaturesGrid from '@/components/FeaturesGrid';
import FeaturedBlogs from '@/components/FeaturedBlogs';

export const metadata = {
  alternates: {
    canonical: '/',
  },
};

// Cache indefinitely until revalidated by tag from backend

async function getOffers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers?active_only=true`, {
      next: { tags: ['offers'] }
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
      next: { tags: ['products', 'new-arrivals'] }
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
      next: { tags: ['products', 'featured-products'] }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getFeaturedBlogs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/featured`, {
      next: { tags: ['blogs', 'featured-blogs'] }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return [];
  }
}

export default async function Home() {
  const [offers, newArrivals, featuredProducts, featuredBlogs] = await Promise.all([
    getOffers(),
    getNewArrivals(),
    getFeaturedProducts(),
    getFeaturedBlogs()
  ]);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-28">
        <h1 className="sr-only">Appleians - Premium Electronics Store</h1>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Appleians",
              "url": "https://www.appleians.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.appleians.com/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Appleians",
              "url": "https://www.appleians.com/",
              "logo": "https://www.appleians.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "01842-430000",
                "contactType": "customer service",
                "areaServed": "BD",
                "availableLanguage": ["English", "Bengali"]
              }
            })
          }}
        />

        <HeroSection offers={offers} />

        <FeaturesGrid />

        <ShopByCategories />

        <FeaturedProductGrid featuredProducts={featuredProducts} />

        <ShopByBrands />

        <NewArrivalsGrid newArrivals={newArrivals} />

        <FeaturedBlogs blogs={featuredBlogs} />

      </main>

      <Footer />
    </div>
  );
}
