'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create Tag State
    const [newTag, setNewTag] = useState({ name: '', slug: '' });
    const [creating, setCreating] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await api.get('/tags');
            const data = response.data || [];
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
            toast.error('Failed to load tags');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTag.name) return;

        setCreating(true);
        try {
            const response = await api.post('/tags', newTag);
            setTags([...tags, response.data]);
            setNewTag({ name: '', slug: '' });
            toast.success('Tag created successfully');
        } catch (error) {
            console.error('Error creating tag:', error);
            const msg = error.response?.data?.message || 'Failed to create tag';
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!tagToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/tags/${tagToDelete.id}`);
            setTags(tags.filter(t => t.id !== tagToDelete.id));
            toast.success('Tag deleted successfully');
            setIsDeleteModalOpen(false);
            setTagToDelete(null);
        } catch (error) {
            console.error('Error deleting tag:', error);
            toast.error('Failed to delete tag');
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDelete = (tag) => {
        setTagToDelete(tag);
        setIsDeleteModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage product tags</p>
                </div>
            </div>

            {/* Create Tag Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Create New Tag</h3>
                <form onSubmit={handleCreate} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tag Name</label>
                        <input
                            type="text"
                            value={newTag.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                setNewTag({ name, slug });
                            }}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Best Seller"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            type="text"
                            value={newTag.slug}
                            onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            placeholder="e.g. best-seller"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 h-[38px]"
                    >
                        {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Add Tag
                    </button>
                </form>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setTagToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Tag"
                message={`Are you sure you want to delete "${tagToDelete?.name}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Tag Name</th>
                                <th className="px-6 py-3">Slug</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                <Tag className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <span className="font-semibold text-gray-900">{tag.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{tag.slug}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/dashboard/tags/${tag.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Tag"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(tag)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Tag"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tags.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                                        No tags found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
