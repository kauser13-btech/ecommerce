'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/api';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditAttributePage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        fetchAttribute();
    }, [id]);

    const fetchAttribute = async () => {
        try {
            const response = await api.get(`/attributes/${id}`);
            const data = response.data;
            setFormData({
                name: data.name
            });
        } catch (error) {
            console.error('Error fetching attribute:', error);
            toast.error('Failed to load attribute');
            router.push('/dashboard/attributes');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/attributes/${id}`, formData);
            toast.success('Attribute updated successfully');
            router.push('/dashboard/attributes');
        } catch (error) {
            console.error('Error saving attribute:', error);
            toast.error('Failed to save attribute');
        } finally {
            setLoading(false);
        }
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
                    Edit Attribute
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attribute Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                            Update Attribute
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
