'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/app/lib/api';

export default function EditBrandPage({ params }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logo: '',
    });

    // Unwrap params using React.use() or await if available in this Next.js version context, 
    // but typically params is a promise in newer Next.js versions for Server Components.
    // Since this is a Client Component ('use client'), params comes as prop directly in some versions,
    // or as a Promise in newer ones (Next 15+).
    // Safest pattern in Next.js 15+ client component:
    // const { id } = React.use(params);

    // However, if params is passed directly:
    const [id, setId] = useState(null);

    useEffect(() => {
        // Resolve params
        Promise.resolve(params).then(p => {
            setId(p.id);
            fetchBrand(p.id);
        });
    }, [params]);

    const fetchBrand = async (brandId) => {
        try {
            const response = await api.get(`/brands/${brandId}`);
            const brand = response.data.data || response.data;
            setFormData({
                name: brand.name,
                slug: brand.slug,
                logo: brand.logo || '',
            });
        } catch (error) {
            console.error('Error fetching brand:', error);
            alert('Failed to load brand data');
            router.push('/dashboard/brands');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/brands/${id}`, formData);
            router.push('/dashboard/brands');
            router.refresh();
        } catch (error) {
            console.error('Error updating brand:', error);
            alert('Failed to update brand');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <Link
                    href="/dashboard/brands"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-2"
                >
                    <ArrowLeft size={16} />
                    Back to Brands
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand Name
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug (Optional)
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo URL
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        placeholder="https://..."
                    />
                    {formData.logo && (
                        <div className="mt-2 p-2 border border-gray-200 rounded-lg inline-block">
                            <img src={formData.logo} alt="Preview" className="h-16 w-auto object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/dashboard/brands"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
