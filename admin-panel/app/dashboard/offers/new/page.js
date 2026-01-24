'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import api from '@/app/lib/api';
import ImagePicker from '@/app/components/ImagePicker';

export default function NewOfferPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        const fetchResources = async () => {
            try {
                const [catsRes, brandsRes, tagsRes, prodsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/brands'),
                    api.get('/tags'),
                    api.get('/products')
                ]);
                setCategories(catsRes.data.data || catsRes.data);
                setBrands(brandsRes.data.data || brandsRes.data);
                setTags(tagsRes.data.data || tagsRes.data);
                setProducts(prodsRes.data.data || prodsRes.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };
        fetchResources();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/offers', formData);
            router.push('/dashboard/offers');
            router.refresh();
        } catch (error) {
            console.error('Error creating offer:', error);
            alert('Failed to create offer');
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="text-2xl font-bold text-gray-900">New Offer</h1>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Source</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <select
                            value={linkType}
                            onChange={(e) => setLinkType(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                    let title = formData.title;

                                    if (linkType === 'product') {
                                        const prod = products.find(p => p.id.toString() === value);
                                        if (prod) {
                                            url = `/products/${prod.slug}`;
                                            productId = prod.id;
                                            if (!title) title = prod.name;
                                        }
                                    } else {
                                        const slug = value;
                                        const prefix = linkType === 'category' ? '/products?category=' : linkType === 'brand' ? '/products?brand=' : '/products?tag=';
                                        url = `${prefix}${slug}`;

                                        let item;
                                        if (linkType === 'category') item = categories.find(i => i.slug === slug);
                                        if (linkType === 'brand') item = brands.find(i => i.slug === slug);
                                        if (linkType === 'tag') item = tags.find(i => i.slug === slug);

                                        if (!title && item) title = item.name || item.title;
                                    }

                                    setFormData(prev => ({
                                        ...prev,
                                        url,
                                        product_id: productId, // Populate product_id only if product selected
                                        title
                                    }));
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                        Create Offer
                    </button>
                </div>
            </form>
        </div>
    );
}
