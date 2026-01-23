'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/api';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditTagPage() {
    const router = useRouter();
    const params = useParams();

    // We can assume params.id exists because this is [id] page
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        slug: ''
    });

    useEffect(() => {
        fetchTag();
    }, [id]);

    const fetchTag = async () => {
        try {
            const response = await api.get(`/tags/${id}`);
            const data = response.data;
            setFormData({
                name: data.name,
                slug: data.slug
            });
        } catch (error) {
            console.error('Error fetching tag:', error);
            toast.error('Failed to load tag');
            router.push('/dashboard/tags');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/tags/${id}`, formData);
            toast.success('Tag updated successfully');
            router.push('/dashboard/tags');
        } catch (error) {
            console.error('Error saving tag:', error);
            toast.error('Failed to save tag');
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (e) => {
        // In edit mode, we generally don't auto-update slug unless explicitly desired to avoid breaking links
        // But if user wants to change name, they might want to change slug too manually.
        const name = e.target.value;
        setFormData(prev => ({ ...prev, name }));
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
                    Edit Tag
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
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

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Update Tag
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
