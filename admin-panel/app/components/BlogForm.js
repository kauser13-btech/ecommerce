'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ImageUpload from '@/app/components/ImageUpload';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function BlogForm({ initialData = null }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        cover_image: '',
        status: 'draft',
        is_pinned: false,
        tags: []
    });

    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                content: initialData.content || '',
                excerpt: initialData.excerpt || '',
                cover_image: initialData.cover_image || '',
                status: initialData.status || 'draft',
                is_pinned: initialData.is_pinned || false,
                tags: initialData.tags || []
            });
            setTagsInput((initialData.tags || []).join(', '));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleTagsChange = (e) => {
        setTagsInput(e.target.value);
        // Split by comma and trim
        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        setFormData(prev => ({ ...prev, tags: tagsArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalFormData = { ...formData };

            // Handle Cover Image Upload if it's a file
            if (formData.cover_image instanceof File) {
                const imageFormData = new FormData();
                imageFormData.append('image', formData.cover_image);

                try {
                    const uploadRes = await api.post('/media', imageFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    finalFormData.cover_image = uploadRes.data.url;
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    toast.error('Failed to upload cover image');
                    setLoading(false);
                    return;
                }
            }

            if (initialData) {
                await api.put(`/admin/blogs/${initialData.id}`, finalFormData);
                toast.success('Blog updated successfully');
            } else {
                await api.post('/admin/blogs', finalFormData);
                toast.success('Blog created successfully');
            }
            router.push('/dashboard/blogs');
        } catch (error) {
            console.error('Error saving blog:', error);
            const msg = error.response?.data?.message || 'Failed to save blog';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-12">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50 z-10 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/blogs" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {initialData ? 'Edit Blog' : 'Create New Blog'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/blogs" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>{initialData ? 'Update Blog' : 'Publish Blog'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium"
                            placeholder="Enter blog title..."
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <div className="h-[400px] mb-12"> {/* Height container including toolbar space */}
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                className="h-[350px]"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Short Summary)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Brief summary for listing pages..."
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Visibility */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Publishing</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_pinned"
                                    name="is_pinned"
                                    checked={formData.is_pinned}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_pinned" className="text-sm text-gray-700">
                                    Pin to Homepage (Max 2)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Cover Image</h3>
                        <ImageUpload
                            value={formData.cover_image}
                            onChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
                            directory="blogs"
                        />
                    </div>

                    {/* Tags */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={handleTagsChange}
                                placeholder="Technology, Guide, News..."
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-500">Separate tags with commas</p>

                            {formData.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Slug (Optional override) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-500"
                            placeholder="auto-generated-from-title"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
