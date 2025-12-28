'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Home, LayoutGrid, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'home'

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            const data = response.data.data || response.data;
            // Ensure sort_order is handled, sort by sort_order
            const sortedData = [...data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            setCategories(sortedData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination || viewMode !== 'home') return;

        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state immediately for smooth UI
        const updatedItems = items.map((item, index) => ({
            ...item,
            sort_order: index
        }));
        setCategories(updatedItems);

        // Save to backend
        try {
            setIsReordering(true);
            await api.post('/categories/reorder', {
                orders: updatedItems.map(item => ({
                    id: item.id,
                    sort_order: item.sort_order
                }))
            });
            toast.success('Order updated');
        } catch (error) {
            console.error('Failed to reorder:', error);
            toast.error('Failed to save order');
            fetchCategories(); // Revert on failure
        } finally {
            setIsReordering(false);
        }
    };

    const filteredCategories = viewMode === 'home'
        ? categories.filter(c => c.show_on_home)
        : categories;

    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/categories/${categoryToDelete.id}`);
            setCategories(categories.filter(c => c.id !== categoryToDelete.id));
            toast.success('Category deleted successfully');
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        } finally {
            setIsDeleting(false);
        }
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
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your product categories and homepage display</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                        <button
                            onClick={() => setViewMode('all')}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <LayoutGrid size={14} /> All
                        </button>
                        <button
                            onClick={() => setViewMode('home')}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'home' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <Home size={14} /> Home Display
                        </button>
                    </div>

                    <Link
                        href="/dashboard/categories/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Link>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                {isReordering && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                )}

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="categories">
                        {(provided) => (
                            <div className="overflow-x-auto" {...provided.droppableProps} ref={provided.innerRef}>
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                        <tr>
                                            {viewMode === 'home' && <th className="px-6 py-3 w-10"></th>}
                                            <th className="px-6 py-3">Category</th>
                                            <th className="px-6 py-3">Parent</th>
                                            <th className="px-6 py-3">Slug</th>
                                            <th className="px-6 py-3 text-center">Home Display</th>
                                            <th className="px-6 py-3 text-right sticky right-0 bg-gray-50 z-10">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCategories.map((category, index) => (
                                            <Draggable
                                                key={category.id}
                                                draggableId={category.id.toString()}
                                                index={index}
                                                isDragDisabled={viewMode !== 'home'}
                                            >
                                                {(provided, snapshot) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`hover:bg-gray-50 group transition-colors ${snapshot.isDragging ? 'bg-blue-50 shadow-lg' : ''}`}
                                                    >
                                                        {viewMode === 'home' && (
                                                            <td className="px-6 py-4" {...provided.dragHandleProps}>
                                                                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                                                            </td>
                                                        )}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                                    {category.image ? (
                                                                        <img src={category.image} alt="" className="w-full h-full object-contain p-1" />
                                                                    ) : (
                                                                        <LayoutGrid className="h-5 w-5 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">{category.name}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">#{category.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {category.parent ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                                    {category.parent.name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300 text-xs italic">Top Level</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{category.slug}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            {category.show_on_home ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    <CheckCircle2 size={12} /> Dashboard
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                                                                    <XCircle size={12} /> Hidden
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-gray-50 transition-colors z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Link
                                                                    href={`/dashboard/categories/${category.id}`}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Edit Category"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => confirmDelete(category)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete Category"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {filteredCategories.length === 0 && (
                                            <tr>
                                                <td colSpan={viewMode === 'home' ? 6 : 5} className="px-6 py-12 text-center text-gray-500 italic">
                                                    No categories found {viewMode === 'home' && 'marked for home display'}.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
