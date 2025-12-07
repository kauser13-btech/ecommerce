'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '@/app/lib/api';

export default function BrandsPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await api.get('/brands');
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
            } catch (error) {
                console.error('Error deleting brand:', error);
                alert('Failed to delete brand');
            }
        }
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Brands</h1>
                <Link
                    href="/dashboard/brands/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Brand
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBrands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {brand.logo ? (
                                            <img src={brand.logo} alt={brand.name} className="h-10 w-10 object-contain rounded bg-gray-50" />
                                        ) : (
                                            <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">No Logo</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{brand.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{brand.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/brands/${brand.id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(brand.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBrands.length === 0 && (
                                <tr>
                                    <td colspan="4" className="px-6 py-8 text-center text-gray-500">
                                        No brands found
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
