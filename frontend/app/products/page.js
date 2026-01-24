import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGridWithToolbar from '@/components/ProductGridWithToolbar';

export const dynamic = 'force-dynamic';

async function getProducts(searchParams) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = new URLSearchParams();

    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.brand) params.append('brand', searchParams.brand);
    if (searchParams.tag) params.append('tag', searchParams.tag);
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

async function getBrands(searchParams) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL(`${apiUrl}/brands`);
    if (searchParams?.category) {
      url.searchParams.append('category', searchParams.category);
    }
    if (searchParams?.tag) {
      url.searchParams.append('tag', searchParams.tag);
    }
    const response = await fetch(url.toString(), { cache: 'no-store' });

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
  const category = searchParams?.category || '';
  const brand = searchParams?.brand || '';
  const tag = searchParams?.tag || '';
  const search = searchParams?.search || '';
  const page = searchParams?.page || 1;

  const [{ data: products, meta }, categories, brands] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getBrands(searchParams),
  ]);

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
                {tag && (
                  <>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 capitalize">Tag: {tag}</span>
                  </>
                )}
              </div>
              {brand ? (
                (() => {
                  const currentBrand = brands.find(b => b.slug === brand);
                  return currentBrand?.logo ? (
                    <div className="flex items-center gap-2">
                      <img src={currentBrand.logo} alt={currentBrand.name} className="h-12 w-auto object-contain mb-4" />
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                        {currentBrand?.name || brand}
                      </h1>
                    </div>
                  ) : (
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                      {currentBrand?.name || brand}
                    </h1>
                  );
                })()
              ) : (
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                  {search ? `Search results for "${search}"` :
                    tag ? `Tagged: #${tag}` :
                      category ? categories.find(c => c.slug === category)?.name || category.replace('-', ' ') :
                        'All Products'}
                </h1>
              )}

              {/* Brands Filter List */}
              {brands.length > 0 && !search && !brand && (
                <div className="mt-8">
                  <div className="flex flex-wrap gap-3">
                    {(() => {
                      // If we are filtering by Tag (or just showing products), we only want to show brands that are RELEVANT to the current product list.
                      // However, 'brands' prop currently comes from `getBrands(category)`.
                      // If category is empty, it returns ALL brands.
                      // If we are on a Tag page, we might want to filter available brands to only those present in the current `products` list.

                      let displayBrands = brands;


                      if (displayBrands.length === 0) return null;

                      return displayBrands.map(b => {
                        const isActive = brand === b.slug;
                        return (
                          <Link
                            key={b.id}
                            href={
                              isActive
                                ? `/products?${new URLSearchParams({ ...searchParams, brand: '' }).toString()}` // Remove brand, keep others (like tag)
                                : `/products?${new URLSearchParams({ ...searchParams, brand: b.slug }).toString()}` // Add brand, keep others
                            }
                            className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${isActive
                              ? 'bg-black border-black text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
                              }`}
                          >
                            {b.logo && (
                              <img
                                src={b.logo}
                                alt={b.name}
                                className={`w-5 h-5 object-contain ${isActive ? 'brightness-0 invert' : ''} group-hover:scale-110 transition-transform`}
                              />
                            )}
                            <span className="text-sm font-medium">{b.name}</span>
                          </Link>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Categories</h3>
                    {(category || brand || tag || search || searchParams?.min_price || searchParams?.max_price) && (
                      <Link
                        href="/products"
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </Link>
                    )}
                  </div>
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
                    {categories.filter(c => !c.parent_id).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-all ${category === cat.slug
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex items-center pl-2 gap-2">
                          {cat.name}
                        </div>
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
