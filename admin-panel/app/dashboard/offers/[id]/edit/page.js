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
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [tags, setTags] = useState([]);
    const [products, setProducts] = useState([]);
    const [linkType, setLinkType] = useState('custom');
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        product_id: '',
        url: '',
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
            const [offerRes, catsRes, brandsRes, tagsRes, productsRes] = await Promise.all([
                api.get(`/offers/${offerId}`),
                api.get('/categories'),
                api.get('/brands'),
                api.get('/tags'),
                api.get('/products')
            ]);

            // Safely handle response data
            const offer = offerRes.data.data || offerRes.data;
            const cats = catsRes.data.data || catsRes.data;
            const brs = brandsRes.data.data || brandsRes.data;
            const tgs = tagsRes.data.data || tagsRes.data;
            const prods = productsRes.data.data || productsRes.data;

            setCategories(cats);
            setBrands(brs);
            setTags(tgs);
            setProducts(prods);

            setFormData({
                title: offer.title,
                image: offer.image,
                product_id: offer.product_id || '',
                url: offer.url || '',
                is_active: offer.is_active,
            });

            // Determine Link Type
            if (offer.product_id) {
                setLinkType('product');
            } else if (offer.url) {
                if (offer.url.includes('category=')) setLinkType('category');
                else if (offer.url.includes('brand=')) setLinkType('brand');
                else if (offer.url.includes('tag=')) setLinkType('tag');
                else setLinkType('custom');
            } else {
                setLinkType('custom');
            }

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
            // Check if image is a File object (new upload) or string (existing URL)
            // If it's a file, we need to upload it first or send as FormData.
            // Backend `OfferController` usually expects JSON or maybe it handles multipart?
            // If standard Laravel resource controller, `update` typically expects data.
            // Let's assume we need to send multipart/form-data if there is a new file.

            const data = new FormData();
            data.append('title', formData.title);
            data.append('product_id', formData.product_id);
            data.append('url', formData.url || '');
            data.append('is_active', formData.is_active ? '1' : '0');

            if (formData.image instanceof File) {
                data.append('image', formData.image);
            } else if (typeof formData.image === 'string' && formData.image.trim() !== '') {
                data.append('image', formData.image);
            } else if (!formData.image) {
                data.append('image', '');
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
                        Link Source
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <select
                            value={linkType}
                            onChange={(e) => setLinkType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="custom">Custom URL</option>
                            <option value="product">Product</option>
                            <option value="category">Category</option>
                            <option value="brand">Brand</option>
                            <option value="tag">Tag</option>
                        </select>

                        {linkType !== 'custom' && (
                            <select
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!value) return;

                                    let url = '';
                                    let productId = '';

                                    if (linkType === 'product') {
                                        const prod = products.find(p => p.id.toString() === value);
                                        if (prod) {
                                            url = `/products/${prod.slug}`;
                                            productId = prod.id;
                                        }
                                    } else {
                                        const slug = value;
                                        const prefix = linkType === 'category' ? '/products?category=' : linkType === 'brand' ? '/products?brand=' : '/products?tag=';
                                        url = `${prefix}${slug}`;
                                    }

                                    setFormData(prev => ({
                                        ...prev,
                                        url,
                                        product_id: productId
                                    }));
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Item...</option>
                                {linkType === 'product' && products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                {linkType === 'category' && categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                                {linkType === 'brand' && brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
                                {linkType === 'tag' && tags.map(t => <option key={t.id} value={t.slug}>{t.name}</option>)}
                            </select>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.url || ''}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="e.g. /products/new-arrivals"
                    />
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
