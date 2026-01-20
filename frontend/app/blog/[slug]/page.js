import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getBlog(slug) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, {
            cache: 'no-store'
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) return { title: 'Blog Not Found' };

    return {
        title: `${blog.title} | Technical News & Insights`,
        description: blog.excerpt,
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            images: blog.cover_image ? [blog.cover_image] : [],
        },
    };
}

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen">
            <Header />

            <main className="pt-28 pb-20">

                {/* Cover Header */}
                <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900">
                    {blog.cover_image && (
                        <div className="absolute inset-0">
                            <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                        <div className="container mx-auto max-w-4xl">
                            <Link href="/blogs" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                                <ArrowLeft size={18} /> Back to Articles
                            </Link>

                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                    {blog.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-6 text-white/80 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <User size={14} />
                                    </div>
                                    <span>{blog.author?.name || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 max-w-4xl mt-12">
                    <div className="bg-white rounded-2xl">
                        {/* Rich Text Content */}
                        <div className="prose prose-lg max-w-none prose-orange prose-headings:font-bold prose-a:text-orange-600">
                            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </div>

                        {/* Share / Footer */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags?.map((tag, idx) => (
                                    <Link key={idx} href={`/blogs?tag=${tag}`} className="flex items-center gap-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors">
                                        <Tag size={14} />
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
