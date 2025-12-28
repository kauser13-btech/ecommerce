'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Search, LayoutGrid, Home, GripVertical, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import api from '@/app/lib/api';

export default function BrandsPage() {
    const searchParams = useSearchParams();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState(searchParams.get('view') === 'home' ? 'home' : 'all'); // 'all' or 'home'
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'home') {
            setViewMode('home');
        } else {
            setViewMode('all');
        }
    }, [searchParams]);

    useEffect(() => {
        fetchBrands();
    }, [viewMode]);

    const fetchBrands = async () => {
        try {
            const params = {};
            if (viewMode === 'home') {
                params.show_on_home = 1;
            }
            const response = await api.get('/brands', { params });
            setBrands(response.data.data || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            try {
                await api.delete(`/brands/${id}`);
                fetchBrands();
                toast.success('Brand deleted successfully');
            } catch (error) {
                console.error('Error deleting brand:', error);
                toast.error('Failed to delete brand');
            }
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination || viewMode !== 'home') return;

        const items = Array.from(brands);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            sort_order: index
        }));

        setBrands(updatedItems);

        try {
            setIsReordering(true);
            await api.post('/brands/reorder', {
                orders: updatedItems.map(item => ({
                    id: item.id,
                    sort_order: item.sort_order
                }))
            });
            toast.success('Order updated');
        } catch (error) {
            console.error('Failed to reorder:', error);
            toast.error('Failed to save order');
            fetchBrands(); // Revert on failure
        } finally {
            setIsReordering(false);
        }
    };

    const filteredBrands = brands.filter(brand => {
        const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesView = viewMode === 'home' ? brand.show_on_home : true;
        return matchesSearch && matchesView;
    });

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 relative">
            {isReordering && (
                <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm rounded-lg">
                    <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-xl border border-gray-100">
                        <Loader2 className="animate-spin text-blue-600" size={24} />
                        <span className="font-medium text-gray-700">Updating order...</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Brands</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage brands and homepage display</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('all')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'all'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <LayoutGrid size={16} />
                            All Brands
                        </button>
                        <button
                            onClick={() => setViewMode('home')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'home'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Home size={16} />
                            Home Display
                        </button>
                    </div>

                    <Link
                        href="/dashboard/brands/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">Add Brand</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="brands-list">
                            {(provided) => (
                                <table className="w-full" {...provided.droppableProps} ref={provided.innerRef}>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {viewMode === 'home' && <th className="w-10 px-6 py-3"></th>}
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Home Display</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBrands.map((brand, index) => (
                                            <Draggable
                                                key={brand.id}
                                                draggableId={brand.id.toString()}
                                                index={index}
                                                isDragDisabled={viewMode !== 'home'}
                                            >
                                                {(provided, snapshot) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`hover:bg-gray-50 group transition-colors ${snapshot.isDragging ? 'bg-blue-50 shadow-lg relative z-10' : ''}`}
                                                    >
                                                        {viewMode === 'home' && (
                                                            <td className="px-6 py-4" {...provided.dragHandleProps}>
                                                                <GripVertical className="h-5 w-5 text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-500" />
                                                            </td>
                                                        )}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 p-1 flex items-center justify-center">
                                                                    {brand.logo ? (
                                                                        <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain" />
                                                                    ) : (
                                                                        <span className="text-gray-400 text-xs font-medium">N/A</span>
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-gray-900">{brand.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                            {brand.slug}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {brand.show_on_home ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                                    <CheckCircle2 size={12} />
                                                                    Visible
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100">
                                                                    <XCircle size={12} />
                                                                    Hidden
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Link
                                                                    href={`/dashboard/brands/${brand.id}/edit`}
                                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil size={16} />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(brand.id)}
                                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {filteredBrands.length === 0 && (
                                            <tr>
                                                <td colSpan={viewMode === 'home' ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Search size={24} className="text-gray-300" />
                                                        <p>No brands found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}
