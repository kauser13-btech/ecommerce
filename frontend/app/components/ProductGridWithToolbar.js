'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from './ProductCard';
// unused imports removed

export default function ProductGridWithToolbar({ products, meta }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [gridSize, setGridSize] = useState(3); // Default to 3 columns

    const currentSort = searchParams.get('sort') || '';
    const currentPage = meta?.current_page || 1;
    const lastPage = meta?.last_page || 1;

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (sortValue) {
            params.set('sort', sortValue);
        } else {
            params.delete('sort');
        }
        // Reset to page 1 on sort change
        params.delete('page');
        router.push(`?${params.toString()}`);
    };

    const getPageUrl = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        return `?${params.toString()}`;
    };

    // Grid classes based on state
    const gridClasses = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-100 gap-4">
                <p className="text-sm text-gray-500 order-2 sm:order-1">
                    Showing <span className="font-bold text-black">{meta?.from || 0}-{meta?.to || 0}</span> of <span className="font-bold text-black">{meta?.total || 0}</span> results
                </p>

                <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Grid Toggles */}
                    <div className="flex items-center gap-2 border-r border-gray-200 pr-4 sm:pr-6">
                        {/* Show grid toggles on mobile too if space permits, or hide. User previous code hid them on lg. 
                             Let's keep user preference or standard. The code was `hidden lg:flex`. 
                             If user wants to change grid on mobile, we should show them. 
                             Let's enable them for all screens but maybe smaller? 
                             Actually user didn't ask to show grid on mobile, but "wrong place" might imply layout shifts.
                             Let's keep grid toggles hidden on mobile if that was the case, 
                             BUT the previous code had `hidden lg:flex` which means HIDDEN on mobile. 
                             So mobile only sees "Sort by".
                             If "Sort by" is the only thing, it should be aligned well.
                          */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={() => setGridSize(2)}
                                className={`p-2 rounded hover:bg-gray-100 ${gridSize === 2 ? 'text-black bg-gray-100' : 'text-gray-400'}`}
                                title="2 Columns"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4h6v16H4V4zm10 0h6v16h-6V4z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setGridSize(3)}
                                className={`p-2 rounded hover:bg-gray-100 ${gridSize === 3 ? 'text-black bg-gray-100' : 'text-gray-400'}`}
                                title="3 Columns"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4h4v16H3V4zm7 0h4v16h-4V4zm7 0h4v16h-4V4z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setGridSize(4)}
                                className={`p-2 rounded hover:bg-gray-100 ${gridSize === 4 ? 'text-black bg-gray-100' : 'text-gray-400'}`}
                                title="4 Columns"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 4h3v16H2V4zm5 0h3v16H7V4zm5 0h3v16h-3V4zm5 0h3v16h-3V4z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end">
                        <label className="text-sm text-gray-500 whitespace-nowrap">Sort by:</label>
                        <div className="relative group min-w-[140px]">
                            <select
                                value={currentSort}
                                onChange={handleSortChange}
                                className="w-full appearance-none bg-transparent pl-0 pr-8 py-2 text-base md:text-sm font-bold text-gray-900 outline-none cursor-pointer focus:ring-0 border-none hover:text-orange-600 transition-colors"
                            >
                                <option value="">Default</option>
                                <option value="featured">Featured</option>
                                <option value="best-selling">Best Selling</option>
                                <option value="title-asc">Alphabetically, A-Z</option>
                                <option value="title-desc">Alphabetically, Z-A</option>
                                <option value="price-asc">Price, low to high</option>
                                <option value="price-desc">Price, high to low</option>
                                <option value="date-desc">Date, new to old</option>
                                <option value="date-asc">Date, old to new</option>
                            </select>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-orange-600 transition-colors">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <>
                    <div className={`grid gap-8 ${gridClasses[gridSize]}`}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && lastPage > 1 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {/* Previous Button */}
                            <Link
                                href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 transition-all ${currentPage > 1
                                    ? 'text-gray-600 hover:border-black hover:text-black'
                                    : 'text-gray-300 pointer-events-none'
                                    }`}
                                aria-disabled={currentPage <= 1}
                            >
                                ←
                            </Link>

                            {/* Page Numbers */}
                            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => {
                                if (
                                    page === 1 ||
                                    page === lastPage ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <Link
                                            key={page}
                                            href={getPageUrl(page)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${currentPage === page
                                                ? 'bg-black text-white border border-black'
                                                : 'border border-gray-200 text-gray-600 hover:border-black hover:text-black'
                                                }`}
                                        >
                                            {page}
                                        </Link>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                                }
                                return null;
                            })}

                            {/* Next Button */}
                            <Link
                                href={currentPage < lastPage ? getPageUrl(currentPage + 1) : '#'}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 transition-all ${currentPage < lastPage
                                    ? 'text-gray-600 hover:border-black hover:text-black'
                                    : 'text-gray-300 pointer-events-none'
                                    }`}
                                aria-disabled={currentPage >= lastPage}
                            >
                                →
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                    <Link href="/products" className="inline-block mt-6 px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                        Clear all filters
                    </Link>
                </div>
            )}
        </div>
    );
}
