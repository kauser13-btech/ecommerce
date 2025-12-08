'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, GripVertical, Check, X, Save, RotateCcw, Loader2 } from 'lucide-react';
import api from '@/app/lib/api';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-hot-toast';

function SortableItem({ offer, index, onDelete, onToggleStatus }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: offer.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm group">
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 flex items-center gap-2">
                <GripVertical size={20} />
                <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-gray-500 w-6 text-center">#{index + 1}</span>
            </div>

            <div className="h-16 w-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {offer.image ? (
                    <img src={offer.image} alt={offer.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                )}
            </div>

            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{offer.title}</h3>
                {offer.product && (
                    <p className="text-sm text-gray-500">Linked: {offer.product.name}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onToggleStatus(offer)}
                    className={`p-2 rounded-full transition-colors ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    title={offer.is_active ? "Active" : "Inactive"}
                >
                    {offer.is_active ? <Check size={16} /> : <X size={16} />}
                </button>

                <Link
                    href={`/dashboard/offers/${offer.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <Pencil size={18} />
                </Link>

                <button
                    onClick={() => onDelete(offer.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default function OffersPage() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasOrderChanged, setHasOrderChanged] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/offers');
            setOffers(response.data);
            setHasOrderChanged(false);
        } catch (error) {
            console.error('Error fetching offers:', error);
            toast.error('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this offer?')) {
            try {
                await api.delete(`/offers/${id}`);
                setOffers(offers.filter(o => o.id !== id));
                toast.success('Offer deleted');
            } catch (error) {
                console.error('Error deleting offer:', error);
                toast.error('Failed to delete offer');
            }
        }
    };

    const handleToggleStatus = async (offer) => {
        try {
            const updatedOffer = { ...offer, is_active: !offer.is_active };
            await api.put(`/offers/${offer.id}`, updatedOffer);
            setOffers(offers.map(o => o.id === offer.id ? updatedOffer : o));
            toast.success(updatedOffer.is_active ? 'Offer activated' : 'Offer deactivated');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = offers.findIndex(o => o.id === active.id);
            const newIndex = offers.findIndex(o => o.id === over.id);

            const newOffers = arrayMove(offers, oldIndex, newIndex);
            setOffers(newOffers);
            setHasOrderChanged(true);
        }
    };

    const handleSaveOrder = async () => {
        setSavingOrder(true);
        try {
            const reorderedItems = offers.map((item, index) => ({
                id: item.id,
                sort_order: index + 1
            }));
            await api.post('/offers/reorder', { offers: reorderedItems });
            setHasOrderChanged(false);
            toast.success('Check frontend, order updated!');
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Failed to save order');
        } finally {
            setSavingOrder(false);
        }
    };

    const handleReset = () => {
        fetchOffers();
    };

    if (loading && offers.length === 0) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Offers</h1>
                    <p className="text-gray-500 text-sm mt-1">Drag to reorder, then save.</p>
                </div>
                <div className="flex items-center gap-2">
                    {hasOrderChanged && (
                        <>
                            <button
                                onClick={handleReset}
                                className="px-3 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
                                title="Reset changes"
                            >
                                <RotateCcw size={18} />
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                            <button
                                onClick={handleSaveOrder}
                                disabled={savingOrder}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all animate-in fade-in"
                            >
                                {savingOrder ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save Order
                            </button>
                        </>
                    )}
                    <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                    <Link
                        href="/dashboard/offers/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm"
                    >
                        <Plus size={20} />
                        New Offer
                    </Link>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={offers.map(o => o.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {offers.map((offer, index) => (
                            <SortableItem
                                key={offer.id}
                                offer={offer}
                                index={index}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {offers.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 border-dashed">
                    No offers found. Create your first offer!
                </div>
            )}
        </div>
    );
}
