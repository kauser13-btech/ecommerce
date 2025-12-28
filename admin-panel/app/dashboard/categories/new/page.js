'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/api';
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import ImagePicker from '../../../components/ImagePicker';
import { toast } from 'react-hot-toast';

export default function CategoryFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params.id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    const [categories, setCategories] = useState([]); // For parent selector
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parent_id: '',
        description: '',
        is_active: true,
        show_on_home: false,
        image: ''
    });

    useEffect(() => {
        fetchDependencies();
        if (isEdit) {
            fetchCategory();
        }
    }, [isEdit]);

    const fetchDependencies = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await api.get(`/categories/${params.id}`);
            const data = response.data.data || response.data;
            setFormData({
                name: data.name,
                slug: data.slug,
                parent_id: data.parent_id || '',
                description: data.description || '',
                is_active: data.is_active ?? true,
                show_on_home: data.show_on_home ?? false,
                image: data.image || ''
            });
        } catch (error) {
            console.error('Error fetching category:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await api.put(`/categories/${params.id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            toast.success(isEdit ? 'Category updated successfully' : 'Category created successfully');
            router.push('/dashboard/categories');
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, name, slug: isEdit ? prev.slug : slug }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Edit Category' : 'Add New Category'}
                </h1>
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>
            </div>

            <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                        <select
                            name="parent_id"
                            value={formData.parent_id}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">None (Top Level)</option>
                            {categories
                                .filter(c => c.id != params.id) // Prevent selecting self as parent
                                .map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Active Status</h3>
                                <p className="text-xs text-gray-500">Enable or disable category</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${formData.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Show on Home</h3>
                                <p className="text-xs text-gray-500">Display in Shop By Category</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, show_on_home: !p.show_on_home }))}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${formData.show_on_home ? 'bg-orange-500' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${formData.show_on_home ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <ImageIcon size={16} /> Category Image
                        </label>
                        <ImagePicker
                            value={formData.image}
                            onChange={(url) => setFormData(p => ({ ...p, image: url }))}
                        />
                        <p className="mt-2 text-xs text-gray-400">This image will be used when displayed in the homepage category section.</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isEdit ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
