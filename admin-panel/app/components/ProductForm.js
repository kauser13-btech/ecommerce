'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

import ErrorModal from './ErrorModal';
import ImageUpload from './ImageUpload';
import { Loader2, Save, ArrowLeft, Trash2, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ProductForm({ initialData, isEdit }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [options, setOptions] = useState([]);
    const [errorModal, setErrorModal] = useState({ isOpen: false, errors: null });

    const [images, setImages] = useState([]); // Unified state: { type: 'existing'|'new', url: string, file?: File }
    const [specs, setSpecs] = useState([]);

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
        const newFormData = { ...formData, specifications: JSON.stringify(specs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})) };
    }, [specs]);

    useEffect(() => {
        fetchDependencies();
        if (initialData) {
            setFormData({
                ...initialData,
                category_id: initialData.category?.id || initialData.category_id,
                brand_id: initialData.brand?.id || initialData.brand_id,
                features: initialData.features || '', // Load features
            });

            // Parse Specifications
            if (initialData.specifications) {
                try {
                    const parsed = typeof initialData.specifications === 'string' ? JSON.parse(initialData.specifications) : initialData.specifications;
                    if (Array.isArray(parsed)) {
                        setSpecs(parsed.map(i => ({ key: i.name || i.key || Object.keys(i)[0], value: i.value || Object.values(i)[0] })));
                    } else if (typeof parsed === 'object') {
                        setSpecs(Object.entries(parsed).map(([key, value]) => ({ key, value })));
                    }
                } catch (e) {
                    console.error("Error parsing specifications", e);
                }
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
            if (initialData.variants) {
                setVariants(initialData.variants);
            }
            if (initialData.options) {
                try {
                    const opts = typeof initialData.options === 'string' ? JSON.parse(initialData.options) : initialData.options;
                    if (Array.isArray(opts)) {
                        setOptions(opts);
                    }
                } catch (e) {
                    console.error("Error parsing options", e);
                }
            }
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

            // Append Variants
            formDataObj.append('variants', JSON.stringify(variants));

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

    const [variants, setVariants] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.preventDefault();
        }
    };

    const generateVariants = () => {
        if (options.length === 0) return;

        const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

        const validOptions = options.filter(opt => opt.name && opt.values.length > 0);
        if (validOptions.length === 0) return;

        const combinations = cartesian(...validOptions.map(opt => opt.values));

        // Adjust logic for single option:
        let finalCombinations = combinations;
        if (validOptions.length === 1) {
            finalCombinations = validOptions[0].values.map(v => [v]);
        }

        const newVariants = finalCombinations.map(combo => {
            // Map values to keys
            const attributes = {};
            combo.forEach((val, idx) => {
                attributes[validOptions[idx].name] = val;
            });

            // Generate basic SKU suggestion
            const skuSuffix = combo.join('-').toUpperCase().replace(/[^A-Z0-9-]/g, '');

            return {
                attributes,
                price: formData.price,
                stock: formData.stock,
                sku: `${formData.sku}-${skuSuffix}`,
                is_active: true
            };
        });

        setVariants(newVariants);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-8">
            {/* header */}
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


            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
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
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                className="bg-white [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg [&_.ql-toolbar]:border-gray-300 [&_.ql-container]:border-gray-300 [&_.ql-editor]:max-h-[400px] [&_.ql-editor]:overflow-y-auto"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'clean']
                                    ],
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                            <ReactQuill
                                theme="snow"
                                value={formData.features || ''}
                                onChange={(value) => setFormData(prev => ({ ...prev, features: value }))}
                                className="bg-white [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg [&_.ql-toolbar]:border-gray-300 [&_.ql-container]:border-gray-300 [&_.ql-editor]:max-h-[400px] [&_.ql-editor]:overflow-y-auto"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'clean']
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-gray-500">Technical details (e.g. Processor: Snapdragon)</p>
                            <button
                                type="button"
                                onClick={() => setSpecs([...specs, { key: '', value: '' }])}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Spec
                            </button>
                        </div>

                        <div className="space-y-3">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-4 items-center group relative rounded-lg">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Name (e.g. Processor)"
                                            value={spec.key}
                                            onChange={(e) => {
                                                const newSpecs = [...specs];
                                                newSpecs[index].key = e.target.value;
                                                setSpecs(newSpecs);
                                                // Sync to form data immediately (optional or do at submit)
                                                const specsObj = newSpecs.reduce((acc, curr) => {
                                                    if (curr.key) acc[curr.key] = curr.value;
                                                    return acc;
                                                }, {});
                                                setFormData({ ...formData, specifications: JSON.stringify(specsObj) });
                                            }}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Value (e.g. Snapdragon)"
                                            value={spec.value}
                                            onChange={(e) => {
                                                const newSpecs = [...specs];
                                                newSpecs[index].value = e.target.value;
                                                setSpecs(newSpecs);
                                                // Sync to form data
                                                const specsObj = newSpecs.reduce((acc, curr) => {
                                                    if (curr.key) acc[curr.key] = curr.value;
                                                    return acc;
                                                }, {});
                                                setFormData({ ...formData, specifications: JSON.stringify(specsObj) });
                                            }}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSpecs = specs.filter((_, i) => i !== index);
                                            setSpecs(newSpecs);
                                            // Sync
                                            const specsObj = newSpecs.reduce((acc, curr) => {
                                                if (curr.key) acc[curr.key] = curr.value;
                                                return acc;
                                            }, {});
                                            setFormData({ ...formData, specifications: JSON.stringify(specsObj) });
                                        }}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {specs.length === 0 && (
                                <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                                    No specifications added
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Generated Variants List */}
                    {variants.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Generated Variants ({variants.length})</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3">Variant</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">Stock</th>
                                            <th className="px-4 py-3">SKU</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((variant, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={variant.sku}
                                                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Product Images */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>

                        <div className="space-y-4">
                            <div>
                                <ImageUpload
                                    value={images.map(img => img.type === 'existing' ? img.url : img.file)}
                                    onChange={(newFiles) => {
                                        // newFiles can be array of mixed URL strings and File objects
                                        // But ImageUpload returns the NEW list.
                                        // We need to sync this back to our `images` state structure:
                                        // { type, url|file }

                                        // Actually `ImageUpload` returns the *entire* new list of values.
                                        // We need to reconstruct our internal state.

                                        const updatedImages = Array.isArray(newFiles) ? newFiles.map(item => {
                                            if (item instanceof File) {
                                                return { type: 'new', file: item, url: URL.createObjectURL(item) };
                                            }
                                            return { type: 'existing', url: item };
                                        }) : [];

                                        setImages(updatedImages);
                                    }}
                                    multiple={true}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload multiple images. The first image will be used as the main thumbnail.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>

                        <div className="flex flex-col gap-4">
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

                    {/* Settings */}
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

                    {/* Variations */}
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

                            {options.length > 0 && (
                                <button
                                    type="button"
                                    onClick={generateVariants}
                                    className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors mt-4"
                                >
                                    Generate Variants from Options
                                </button>
                            )}
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
