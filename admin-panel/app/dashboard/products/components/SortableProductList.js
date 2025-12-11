'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GripVertical, Save, RotateCcw, Loader2, ArrowLeft } from 'lucide-react';
import api from '@/app/lib/api';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-hot-toast';

function SortableItem({ product, index }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });

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

            <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                )}
            </div>

            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">
                    ৳{Number(product.price).toLocaleString()}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href={`/dashboard/products/${product.id}`}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Edit
                </Link>
            </div>
        </div>
    );
}

export default function SortableProductList({ title, type, fetchEndpoint }) {
    const [products, setProducts] = useState([]);
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
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get(fetchEndpoint);
            setProducts(response.data);
            setHasOrderChanged(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = products.findIndex(p => p.id === active.id);
            const newIndex = products.findIndex(p => p.id === over.id);

            const newProducts = arrayMove(products, oldIndex, newIndex);
            setProducts(newProducts);
            setHasOrderChanged(true);
        }
    };

    const handleSaveOrder = async () => {
        setSavingOrder(true);
        try {
            const reorderedItems = products.map((item, index) => ({
                id: item.id,
                order: index + 1
            }));

            await api.post('/products/reorder', {
                items: reorderedItems,
                type: type
            });

            setHasOrderChanged(false);
            toast.success('Order updated successfully!');
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Failed to save order');
        } finally {
            setSavingOrder(false);
        }
    };

    if (loading && products.length === 0) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/products" className="text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-7">Drag to reorder {title.toLowerCase()}.</p>
                </div>

                <div className="flex items-center gap-2">
                    {hasOrderChanged && (
                        <>
                            <button
                                onClick={fetchProducts}
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
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={products.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {products.map((product, index) => (
                            <SortableItem
                                key={product.id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {products.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 border-dashed">
                    No {title.toLowerCase()} found.
                </div>
            )}
        </div>
    );
}
