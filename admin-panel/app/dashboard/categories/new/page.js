'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/api';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

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
        description: ''
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
                description: data.description || ''
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
            router.push('/dashboard/categories');
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
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
