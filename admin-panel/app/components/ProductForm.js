'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

import ErrorModal from './ErrorModal';
import { Loader2, Save, ArrowLeft, Trash2, Plus, Upload, X } from 'lucide-react';

export default function ProductForm({ initialData, isEdit }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [options, setOptions] = useState([]);
    const [errorModal, setErrorModal] = useState({ isOpen: false, errors: null });

    const [images, setImages] = useState([]); // Unified state: { type: 'existing'|'new', url: string, file?: File }

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sku: '',
        description: '',
        price: '',
        original_price: '',
        stock: '',
        category_id: '',
        brand_id: '',
        image: '',
        is_active: true,
        is_featured: false,
        is_new: false,
        features: '',
        specifications: '{}'
    });

    useEffect(() => {
        fetchDependencies();
        if (initialData) {
            setFormData({
                ...initialData,
                category_id: initialData.category?.id || initialData.category_id,
                category_id: initialData.category?.id || initialData.category_id,
                brand_id: initialData.brand?.id || initialData.brand_id,
            });
        }
        if (initialData.images) {
            try {
                const imgs = typeof initialData.images === 'string' ? JSON.parse(initialData.images) : initialData.images;
                if (Array.isArray(imgs)) {
                    setImages(imgs.map(url => ({ type: 'existing', url })));
                }
            } catch (e) {
                console.error("Error parsing initial images", e);
            }
        } else if (initialData.image) {
            setImages([{ type: 'existing', url: initialData.image }]);
        }

    }, [initialData]);

    const fetchDependencies = async () => {
        try {
            const [catsRes, brandsRes] = await Promise.all([
                api.get('/categories'),
                api.get('/brands')
            ]);
            setCategories(catsRes.data.data || catsRes.data);
            setBrands(brandsRes.data.data || brandsRes.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataObj = new FormData();

            // Append regular fields
            Object.keys(formData).forEach(key => {
                if (key === 'image' || key === 'images') return; // Skip image fields, handled separately or via files
                let value = formData[key];

                // Convert booleans to 1/0 for backend validation
                if (typeof value === 'boolean') {
                    value = value ? '1' : '0';
                }

                if (key === 'specifications' && typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                formDataObj.append(key, value);
            });

            // Append Options
            formDataObj.append('options', JSON.stringify(options));

            // Separate images
            const existingImages = images.filter(img => img.type === 'existing').map(img => img.url);
            const newImageFiles = images.filter(img => img.type === 'new').map(img => img.file);

            // Append Existing Images
            existingImages.forEach(url => {
                formDataObj.append('existing_images[]', url);
            });

            // Append New Images
            newImageFiles.forEach((file) => {
                formDataObj.append('images[]', file);
            });

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (isEdit) {
                // For update, we might need to handle _method: PUT for Laravel to process files correctly 
                // (standard Laravel behavior for PUT/PATCH with files)
                formDataObj.append('_method', 'PUT');
                await api.post(`/products/${initialData.id}`, formDataObj, config);
            } else {
                await api.post('/products', formDataObj, config);
            }
            router.push('/dashboard/products');
        } catch (error) {
            console.error('Error saving product:', error);
            const errors = error.response?.data?.errors || error.response?.data?.message || error.message;
            setErrorModal({ isOpen: true, errors });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            type: 'new',
            url: URL.createObjectURL(file),
            file
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddOption = () => {
        setOptions([...options, { name: '', values: [] }]);
    };

    const handleRemoveOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        if (field === 'values') {
            newOptions[index][field] = value.split(',').map(v => v.trim());
        } else {
            newOptions[index][field] = value;
        }
        setOptions(newOptions);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isEdit ? 'Update Product' : 'Create Product'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                <input
                                    type="number"
                                    name="original_price"
                                    value={formData.original_price}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>



                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Variations</h3>
                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>

                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2 relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Name (e.g. Color)"
                                        value={option.name}
                                        onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Values (comma separated)"
                                        value={option.values.join(', ')}
                                        onChange={(e) => handleOptionChange(index, 'values', e.target.value)}
                                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                            {options.length === 0 && (
                                <p className="text-sm text-gray-500 italic text-center py-2">No variations added</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Organization</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <select
                                name="brand_id"
                                value={formData.brand_id}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Brand</option>
                                {brands.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Media</h3>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>

                        <div className="flex flex-wrap gap-4 mb-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                                    <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                <Upload className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">Upload</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="text-xs text-gray-500">
                            Upload multiple images. The first image will be used as the main thumbnail.
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Featured Product</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="is_new"
                                    checked={formData.is_new}
                                    onChange={handleChange}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">New Arrival</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>


            <ErrorModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                errors={errorModal.errors}
            />
        </form >
    );
}
