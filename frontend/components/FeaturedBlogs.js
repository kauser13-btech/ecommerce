'use client';

import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export default function FeaturedBlogs({ blogs }) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">News & Insights</h2>
                    </div>
                    <Link
                        href="/blogs"
                        className="hidden md:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                        All Articles <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            href={`/blog/${blog.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
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
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    {blog.tags && blog.tags.length > 0 && (
                                        <span className="text-orange-600 font-medium">{blog.tags[0]}</span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                    {blog.title}
                                </h3>

                                <p className="text-gray-600 line-clamp-2 mb-6">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center text-orange-600 font-bold text-sm">
                                    Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                        View All Articles <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
