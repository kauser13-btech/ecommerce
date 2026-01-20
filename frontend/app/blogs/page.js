import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getBlogs(tag) {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
        if (tag) url.searchParams.append('tag', tag);

        const response = await fetch(url.toString(), { cache: 'no-store' });
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
}

export default async function BlogListingPage({ searchParams }) {
    // Await searchParams in Next.js 15+ if needed, but standard is async
    // The 'searchParams' prop is a plain object in older Next, waiting for it is safe.
    const params = await searchParams; // Ensure valid access
    const tag = params?.tag;

    const blogs = await getBlogs(tag);

    return (
        <div className="bg-white min-h-screen">
            <Header />

            <main className="pt-28 pb-20">
                {/* Header Section */}
                <section className="bg-gray-50 py-16 mb-12">
                    <div className="container mx-auto px-4 max-w-7xl text-center">
                        <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">Technical News & Insights</h3>
                        {tag && (
                            <div className="mt-8">
                                <span className="inline-flex items-center px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-medium">
                                    Filtered by: {tag}
                                    <Link href="/blogs" className="ml-2 hover:text-orange-900">
                                        ×
                                    </Link>
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-7xl">
                    {blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No articles found</h3>
                            <p className="text-gray-500 mt-2">Check back later for new content.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <article key={blog.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                                    {/* Image */}
                                    <Link href={`/blog/${blog.slug}`} className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                                        {blog.cover_image ? (
                                            <img
                                                src={blog.cover_image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                No Image
                                            </div>
                                        )}
                                        {blog.is_pinned && (
                                            <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                Featured
                                            </div>
                                        )}
                                    </Link>

                                    <div className="p-6 flex flex-col flex-1">
                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                            {blog.tags && blog.tags[0] && (
                                                <Link href={`/blogs?tag=${blog.tags[0]}`} className="text-orange-600 hover:underline">
                                                    {blog.tags[0]}
                                                </Link>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <Link href={`/blog/${blog.slug}`} className="block mb-3">
                                            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                {blog.title}
                                            </h2>
                                        </Link>

                                        {/* Excerpt */}
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                            {blog.excerpt}
                                        </p>

                                        {/* Footer */}
                                        <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <User size={14} className="text-gray-500" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">Admin</span>
                                            </div>
                                            <Link href={`/blog/${blog.slug}`} className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1">
                                                Read <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Icon for empty state (since we didn't import FileText)
function FileText({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
