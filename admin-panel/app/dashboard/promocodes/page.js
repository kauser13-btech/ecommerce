'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { Plus, Pencil, Trash2, Search, Loader2, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

export default function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [promoToDelete, setPromoToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const response = await api.get('/promocodes');
            setPromoCodes(response.data);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
            toast.error('Failed to load promo codes');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (promo) => {
        setPromoToDelete(promo);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!promoToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/promocodes/${promoToDelete.id}`);
            setPromoCodes(promoCodes.filter(p => p.id !== promoToDelete.id));
            toast.success('Promo code deleted successfully');
            setIsDeleteModalOpen(false);
            setPromoToDelete(null);
        } catch (error) {
            console.error('Error deleting promo code:', error);
            toast.error('Failed to delete promo code');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredPromoCodes = promoCodes.filter(promo =>
        promo.code.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setPromoToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Promo Code"
                message={`Are you sure you want to delete "${promoToDelete?.code}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
                <Link
                    href="/dashboard/promocodes/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Promo Code
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search codes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Discount</th>
                                <th className="px-6 py-3">Min Order</th>
                                <th className="px-6 py-3">Expires At</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPromoCodes.map((promo) => (
                                <tr key={promo.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            {promo.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {promo.type === 'percent' ? `${promo.value}%` : `৳${promo.value}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        {promo.min_order_amount ? `৳${Number(promo.min_order_amount).toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {promo.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/promocodes/${promo.id}`}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(promo);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
