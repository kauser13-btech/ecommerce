'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/app/lib/api';
import ImageUpload from '@/app/components/ImageUpload';

export default function EditOfferPage({ params }) {
    const router = useRouter();
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        image: '', // Can be URL string or File object
        product_id: '',
        is_active: true,
    });

    useEffect(() => {
        Promise.resolve(params).then(p => {
            setId(p.id);
            fetchInitialData(p.id);
        });
    }, [params]);

    const fetchInitialData = async (offerId) => {
        try {
            const [offerRes, productsRes] = await Promise.all([
                api.get(`/offers/${offerId}`),
                api.get('/products')
            ]);

            const offer = offerRes.data.data || offerRes.data;
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
            // toast.error is better but alert is in original code
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
            // Check if image is a File object (new upload) or string (existing URL)
            // If it's a file, we need to upload it first or send as FormData.
            // Backend `OfferController` usually expects JSON or maybe it handles multipart?
            // If standard Laravel resource controller, `update` typically expects data.
            // Let's assume we need to send multipart/form-data if there is a new file.

            const data = new FormData();
            data.append('title', formData.title);
            data.append('product_id', formData.product_id);
            data.append('is_active', formData.is_active ? '1' : '0');

            if (formData.image instanceof File) {
                data.append('image', formData.image);
            } else if (typeof formData.image === 'string') {
                // If it's a string, we might not need to send it if backend ignores missing 'image' key,
                // OR we send it as 'image_url' if backend supports it.
                // Or maybe backend expects 'image' to be null if not updating?
                // Let's just NOT append 'image' if it's the existing URL string, 
                // UNLESS backend requires it to not delete the old one.
                // Safer: don't append if it's a string (no change).
                // But wait, if backend expects 'image' field to update...
                // Usually: if (hasFile('image')) update it.
            }

            // PUT requests with FormData in Laravel/PHP can be tricky (method spoofing).
            data.append('_method', 'PUT');

            await api.post(`/offers/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // await api.put(`/offers/${id}`, formData); // Old JSON way

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
                    <ImageUpload
                        value={formData.image}
                        onChange={(file) => setFormData({ ...formData, image: file })}
                        helpText="Recommended size: 800x600px"
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
