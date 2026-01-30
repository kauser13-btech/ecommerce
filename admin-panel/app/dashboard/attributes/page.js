'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

export default function AttributesPage() {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create Attribute State
    const [newAttribute, setNewAttribute] = useState({ name: '' });
    const [creating, setCreating] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [attributeToDelete, setAttributeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchAttributes();
    }, []);

    const fetchAttributes = async () => {
        try {
            const response = await api.get('/attributes');
            const data = response.data || [];
            setAttributes(data);
        } catch (error) {
            console.error('Error fetching attributes:', error);
            toast.error('Failed to load attributes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newAttribute.name) return;

        const invalidNames = ['color', 'colors', 'colour', 'colours'];
        if (invalidNames.includes(newAttribute.name.trim().toLowerCase())) {
            toast.error("Attribute name cannot be 'Color' or 'Colors'.");
            return;
        }

        setCreating(true);
        try {
            const response = await api.post('/attributes', newAttribute);
            setAttributes([...attributes, response.data]);
            setNewAttribute({ name: '' });
            toast.success('Attribute created successfully');
        } catch (error) {
            console.error('Error creating attribute:', error);
            const msg = error.response?.data?.message || 'Failed to create attribute';
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!attributeToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/attributes/${attributeToDelete.id}`);
            setAttributes(attributes.filter(a => a.id !== attributeToDelete.id));
            toast.success('Attribute deleted successfully');
            setIsDeleteModalOpen(false);
            setAttributeToDelete(null);
        } catch (error) {
            console.error('Error deleting attribute:', error);
            toast.error('Failed to delete attribute');
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDelete = (attribute) => {
        setAttributeToDelete(attribute);
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
                    <h1 className="text-2xl font-bold text-gray-900">Attributes</h1>
                </div>
            </div>

            {/* Create Attribute Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Create New Attribute</h3>
                <form onSubmit={handleCreate} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Attribute Name</label>
                        <input
                            type="text"
                            value={newAttribute.name}
                            onChange={(e) => setNewAttribute({ name: e.target.value })}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Size, Material"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 h-[38px]"
                    >
                        {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Add Attribute
                    </button>
                </form>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setAttributeToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Attribute"
                message={`Are you sure you want to delete "${attributeToDelete?.name}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Attribute Name</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attributes.map((attribute) => (
                                <tr key={attribute.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                <Tag className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <span className="font-semibold text-gray-900">{attribute.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/dashboard/attributes/${attribute.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Attribute"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(attribute)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Attribute"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {attributes.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-500 italic">
                                        No attributes found.
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
