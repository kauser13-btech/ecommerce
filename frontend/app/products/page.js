import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGridWithToolbar from '../components/ProductGridWithToolbar';

export const dynamic = 'force-dynamic';

async function getProducts(searchParams) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = new URLSearchParams();

    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.brand) params.append('brand', searchParams.brand);
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.min_price) params.append('min_price', searchParams.min_price);
    if (searchParams.max_price) params.append('max_price', searchParams.max_price);
    if (searchParams.page) params.append('page', searchParams.page);
    if (searchParams.sort) params.append('sort', searchParams.sort);

    const url = `${apiUrl}/products${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Fetching products from:', url);

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return { data: [], meta: null };
    }

    const json = await response.json();
    return {
      data: json.data || [],
      meta: {
        current_page: json.current_page,
        last_page: json.last_page,
        total: json.total,
        from: json.from,
        to: json.to,
        links: json.links
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], meta: null };
  }
}

async function getCategories() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/categories`, { cache: 'no-store' });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getBrands() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/brands`, { cache: 'no-store' });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function ProductsPage(props) {
  const searchParams = await props.searchParams;
  const [{ data: products, meta }, categories, brands] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getBrands(),
  ]);
  const category = searchParams?.category || '';
  const brand = searchParams?.brand || '';
  const search = searchParams?.search || '';
  const currentPage = meta?.current_page || 1;

  // Helper to generate pagination URL
  const getPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    return `/products?${params.toString()}`;
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-28">
        {/* Category Hero Section */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="text-sm text-gray-500 mb-4 font-medium flex items-center gap-2">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900">Products</span>
                {category && (
                  <>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 capitalize">{category.replace('-', ' ')}</span>
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                {search ? `Search results for "${search}"` :
                  brand ? brands.find(b => b.slug === brand)?.name || brand :
                    category ? categories.find(c => c.slug === category)?.name || category.replace('-', ' ') :
                      'All Products'}
              </h1>
              <p className="text-gray-500 text-lg">
                Explore our collection of {meta?.total || 0} premium products
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex gap-12">
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-32 space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Categories</h3>
                  <div className="space-y-1">
                    <Link
                      href="/products"
                      className={`block px-3 py-2 rounded-lg text-sm transition-all ${!category
                        ? 'bg-black text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      All Categories
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-all ${category === cat.slug
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {cat.icon && <span>{cat.icon}</span>}
                          {cat.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Brands</h3>
                  <div className="space-y-1">
                    <Link
                      href="/products"
                      className={`block px-3 py-2 rounded-lg text-sm transition-all ${!brand
                        ? 'bg-black text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      All Brands
                    </Link>
                    {brands.map((brandItem) => (
                      <Link
                        key={brandItem.slug}
                        href={`/products?brand=${brandItem.slug}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-all ${brand === brandItem.slug
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {brandItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <ProductGridWithToolbar products={products} meta={meta} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
