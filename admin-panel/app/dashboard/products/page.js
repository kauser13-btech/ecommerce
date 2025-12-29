'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { Plus, Pencil, Trash2, Search, Loader2, Check, X, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const showFeaturedOnly = searchParams.get('featured') === 'true';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products?include_inactive=true');
            setProducts(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async (id, field, value) => {
        // Find existing product to check if value actually changed
        const product = products.find(p => p.id === id);
        if (!product || product[field] == value) return; // loose comparison for number/string

        try {
            const updatedProduct = { ...product, [field]: value };
            // Optimistic update
            setProducts(products.map(p => p.id === id ? updatedProduct : p));
            await api.put(`/products/${id}`, { [field]: value });
            toast.success(`${field === 'price' ? 'Price' : 'Stock'} updated`);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            toast.error(`Failed to update ${field}`);
            // Revert
            setProducts(products.map(p => p.id === id ? product : p));
        }
    };

    const handleToggleStatus = async (product) => {
        try {
            const updatedProduct = { ...product, is_active: !product.is_active };
            setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
            await api.put(`/products/${product.id}`, { is_active: updatedProduct.is_active });
            toast.success(updatedProduct.is_active ? 'Product activated' : 'Product deactivated');
        } catch (error) {
            console.error('Error updating product status:', error);
            toast.error('Failed to update product status');
            setProducts(products.map(p => p.id === product.id ? product : p));
        }
    };

    const handleToggleFeatured = async (product) => {
        try {
            const updatedProduct = { ...product, is_featured: !product.is_featured };
            setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
            await api.put(`/products/${product.id}`, { is_featured: updatedProduct.is_featured });
            toast.success(updatedProduct.is_featured ? 'Added to featured' : 'Removed from featured');
        } catch (error) {
            console.error('Error updating featured status:', error);
            toast.error('Failed to update featured status');
            setProducts(products.map(p => p.id === product.id ? product : p));
        }
    };

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/products/${productToDelete.id}`);
            setProducts(products.filter(p => p.id !== productToDelete.id));
            toast.success('Product deleted successfully');
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesFeatured = showFeaturedOnly ? product.is_featured === 1 || product.is_featured === true : true;
        return matchesSearch && matchesFeatured;
    });

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
                    setProductToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {showFeaturedOnly ? 'Featured Products' : 'Products'}
                    </h1>
                    {showFeaturedOnly && (
                        <p className="text-sm text-gray-500 mt-1">Showing only featured items</p>
                    )}
                </div>
                <Link
                    href="/dashboard/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
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
                            placeholder="Search products..."
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
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Original Price</th>
                                <th className="px-6 py-3">Cash Price</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3 text-center">Variants</th>
                                <th className="px-6 py-3">Featured</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            {product.image && (
                                                <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                                            )}
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Original Price is usually higher, checking format */}
                                        {product.original_price ? `৳${Number(product.original_price).toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className="mr-1 text-gray-500">৳</span>
                                            <input
                                                type="number"
                                                defaultValue={product.price}
                                                onBlur={(e) => handleUpdateProduct(product.id, 'price', e.target.value)}
                                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            defaultValue={product.stock}
                                            onBlur={(e) => handleUpdateProduct(product.id, 'stock', e.target.value)}
                                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.variants_count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {product.variants_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleFeatured(product)}
                                            className={`p-1 rounded-full transition-colors ${product.is_featured ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                                            title={product.is_featured ? "Remove from featured" : "Add to featured"}
                                        >
                                            <Star className="h-5 w-5" fill={product.is_featured ? "currentColor" : "none"} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(product)}
                                                className={`p-2 rounded-full transition-colors ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                                title={product.is_active ? "Active" : "Inactive"}
                                            >
                                                {product.is_active ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            </button>
                                            <Link
                                                href={`/dashboard/products/${product.id}`}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit Product"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(product);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Product"
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
