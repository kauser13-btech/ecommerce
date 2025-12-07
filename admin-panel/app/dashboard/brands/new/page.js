'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import api from '@/app/lib/api';

export default function NewBrandPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logo: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/brands', formData);
            router.push('/dashboard/brands');
            router.refresh();
        } catch (error) {
            console.error('Error creating brand:', error);
            alert('Failed to create brand');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'brand_logo');

        try {
            // Using a generic media upload endpoint if available, otherwise defaulting to direct string input for now
            // or specialized endpoint if built. Assuming standard /upload or similar.
            // If backend doesn't support generic upload, text input is fallback.
            // For now, let's assume valid implementation requires backend upload or returns url
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, logo: response.data.url }));
        } catch (error) {
            console.error('Upload failed:', error);
            // alert('Upload failed. Please enter URL manually.');
        }
    };

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
                <h1 className="text-2xl font-bold text-gray-900">Add New Brand</h1>
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
                        placeholder="Automatic if left empty"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.logo}
                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                            placeholder="https://..."
                        />
                        {/* <div className="relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleLogoUpload}
                                accept="image/*"
                            />
                            <button type="button" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2">
                                <Upload size={18} />
                                Upload
                            </button>
                        </div> */}
                    </div>
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
                        Create Brand
                    </button>
                </div>
            </form>
        </div>
    );
}
