'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/app/lib/api';
import ImagePicker from '@/app/components/ImagePicker';

export default function EditOfferPage({ params }) {
    const router = useRouter();
    // In Next.js 15+ params is a Promise. Resolve it.
    // However, depending on version it might differ. Assuming Promise pattern or use() hook.
    // For now, using standard Promise resolution in useEffect to be safe.

    // Actually, React.use() is preferred if checking recent Next.js docs, but let's stick to useEffect for broad compatibility or if uncertain.
    // Simplest approach: params is a prop, if it's a promise, we await it.

    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        product_id: '',
        is_active: true,
    });

    useEffect(() => {
        // Resolve params
        Promise.resolve(params).then(p => {
            setId(p.id);
            fetchInitialData(p.id);
        });
    }, [params]);

    const fetchInitialData = async (offerId) => {
        try {
            const [offerRes, productsRes] = await Promise.all([
                api.get(`/offers/${offerId}`),
                api.get('/products') // Assuming /products returns list
            ]);

            const offer = offerRes.data.data || offerRes.data; // Handle potential API resource wrapper
            const productList = productsRes.data.data || productsRes.data;

            setProducts(productList);
            setFormData({
                title: offer.title,
                image: offer.image,
                product_id: offer.product_id || '',
                is_active: offer.is_active,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load offer data');
            router.push('/dashboard/offers');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/offers/${id}`, formData);
            router.push('/dashboard/offers');
            router.refresh();
        } catch (error) {
            console.error('Error updating offer:', error);
            alert('Failed to update offer');
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
                    href="/dashboard/offers"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-2"
                >
                    <ArrowLeft size={16} />
                    Back to Offers
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edit Offer</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image
                    </label>
                    <ImagePicker
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Linked Product
                    </label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.product_id}
                        onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                    >
                        <option value="">No Product Linked</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        Active
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/dashboard/offers"
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
