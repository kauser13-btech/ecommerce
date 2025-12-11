import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import api from '@/app/lib/api';
import ImageUpload from '@/app/components/ImageUpload';

export default function NewBrandPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logo: '', // Can be File or string
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            if (formData.slug) data.append('slug', formData.slug);

            if (formData.logo instanceof File) {
                data.append('logo', formData.logo);
            } else if (typeof formData.logo === 'string' && formData.logo) {
                data.append('logo', formData.logo);
            }

            await api.post('/brands', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            router.push('/dashboard/brands');
            router.refresh();
        } catch (error) {
            console.error('Error creating brand:', error);
            alert('Failed to create brand');
        } finally {
            setLoading(false);
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
                        Brand Logo
                    </label>
                    <ImageUpload
                        value={formData.logo}
                        onChange={(file) => setFormData({ ...formData, logo: file })}
                        label="Upload Logo"
                    />
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
