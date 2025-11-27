import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

async function getProducts(searchParams) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = new URLSearchParams();

    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.brand) params.append('brand', searchParams.brand);
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.min_price) params.append('min_price', searchParams.min_price);
    if (searchParams.max_price) params.append('max_price', searchParams.max_price);

    const url = `${apiUrl}/products${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Fetching products from:', url);

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return [];
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
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

export default async function ProductsPage({ searchParams }) {
  const [products, categories, brands] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getBrands(),
  ]);
  const category = searchParams?.category || '';
  const brand = searchParams?.brand || '';
  const search = searchParams?.search || '';

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-6">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Products</span>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900 capitalize">{category.replace('-', ' ')}</span>
              </>
            )}
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Filters</h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm mb-3">Categories</h4>
                  <div className="space-y-2">
                    <a
                      href="/products"
                      className={`block text-sm hover:text-blue-600 ${!category ? 'text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                    >
                      All Categories
                    </a>
                    {categories.map((cat) => (
                      <a
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className={`block text-sm hover:text-blue-600 ${category === cat.slug ? 'text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                      >
                        {cat.icon && <span className="mr-1">{cat.icon}</span>}
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm mb-3">Brands</h4>
                  <div className="space-y-2">
                    <a
                      href="/products"
                      className={`block text-sm hover:text-blue-600 ${!brand ? 'text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                    >
                      All Brands
                    </a>
                    {brands.map((brandItem) => (
                      <a
                        key={brandItem.slug}
                        href={`/products?brand=${brandItem.slug}`}
                        className={`block text-sm hover:text-blue-600 ${brand === brandItem.slug ? 'text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                      >
                        {brandItem.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <a href="/products?price=0-25000" className="block text-sm text-gray-700 hover:text-blue-600">
                      Under ৳25,000
                    </a>
                    <a href="/products?price=25000-50000" className="block text-sm text-gray-700 hover:text-blue-600">
                      ৳25,000 - ৳50,000
                    </a>
                    <a href="/products?price=50000-100000" className="block text-sm text-gray-700 hover:text-blue-600">
                      ৳50,000 - ৳100,000
                    </a>
                    <a href="/products?price=100000+" className="block text-sm text-gray-700 hover:text-blue-600">
                      Above ৳100,000
                    </a>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium text-sm mb-3">Availability</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">Pre-order</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {search ? `Search Results for "${search}"` :
                      brand ? brands.find(b => b.slug === brand)?.name || brand.charAt(0).toUpperCase() + brand.slice(1) :
                        category ? categories.find(c => c.slug === category)?.name || category.replace('-', ' ').toUpperCase() :
                          'All Products'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">{products.length} products found</p>
                </div>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Best Selling</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
