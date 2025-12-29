'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

import ErrorModal from './ErrorModal';
import DuplicateSlugModal from './DuplicateSlugModal';
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
    const [options, setOptions] = useState(initialData?.options ? [] : [{ name: 'Color', values: [] }]);
    const [errorModal, setErrorModal] = useState({ isOpen: false, errors: null });
    const [slugModalOpen, setSlugModalOpen] = useState(false);
    const [pendingSaveRedirect, setPendingSaveRedirect] = useState(null);

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
        is_preorder: false,
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

    const validate = (data = formData) => {
        const errors = {};
        if (!data.name) errors.name = 'Please enter the product name';
        if (!data.price) errors.price = 'Please set a price for the product';
        if (!data.category_id) errors.category_id = 'Please select a category';
        if (!data.brand_id) errors.brand_id = 'Please select a brand';
        if (!data.stock) errors.stock = 'Please define the stock quantity';
        if (!data.sku) errors.sku = 'Please provide a unique SKU';

        // Remove HTML tags to check if description is empty
        const cleanDescription = data.description?.replace(/<[^>]+>/g, '').trim();
        if (!cleanDescription) errors.description = 'Please add a product description';

        if (images.length === 0) {
            errors.images = 'Please upload at least one image for the product';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    };

    const saveProduct = async (shouldRedirect = true, overrideData = null) => {
        // Use override data for validation if provided, merging with current state
        const dataToSubmit = overrideData ? { ...formData, ...overrideData } : formData;

        const errors = validate(dataToSubmit);
        if (errors) {
            setErrorModal({ isOpen: true, errors: Object.values(errors) });
            return;
        }

        setLoading(true);

        try {
            const formDataObj = new FormData();

            // Append regular fields
            Object.keys(dataToSubmit).forEach(key => {
                if (key === 'image' || key === 'images') return;
                let value = dataToSubmit[key];

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

            // Append Variant Images
            variants.forEach((variant, index) => {
                if (variant.image_file) {
                    formDataObj.append(`variant_images[${index}]`, variant.image_file);
                }
            });

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            let response;
            if (isEdit) {
                // For update, we might need to handle _method: PUT for Laravel to process files correctly 
                // (standard Laravel behavior for PUT/PATCH with files)
                formDataObj.append('_method', 'PUT');
                response = await api.post(`/products/${initialData.id}`, formDataObj, config);
            } else {
                response = await api.post('/products', formDataObj, config);
            }

            toast.success('Product saved successfully');

            if (shouldRedirect) {
                router.push('/dashboard/products');
            } else {
                // If staying, we might want to refresh data or just keep as is
                // But if it was "Create", we are now in "Edit" theoretically, handling that might be complex
                // For now, assuming "Update and Stay" keeps on same page.
                // If it was create, we probably need to redirect to edit page or reset form?
                // For this task, user usually asks for Edit page.
                if (!isEdit && response?.data?.data?.id) {
                    // If we created a product and chose to stay, switch to edit page (which is just /products/[id])
                    router.push(`/dashboard/products/${response.data.data.id}`);
                }
            }

        } catch (error) {
            console.error('Error saving product:', error);
            const errors = error.response?.data?.errors || error.response?.data?.message || error.message;

            // Check if it's a slug duplicate error
            const slugError = error.response?.data?.errors?.slug;
            if (slugError && slugError.some(msg => msg.includes('taken') || msg.includes('unique'))) {
                setPendingSaveRedirect(shouldRedirect);
                setSlugModalOpen(true);
            } else {
                setErrorModal({ isOpen: true, errors });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAnyway = () => {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        const newSlug = `${formData.slug}-${randomSuffix}`;

        // Update state and retry save immediately
        // We need to use updated state for save, so bestway is setting it and calling save in useEffect or passing passed data?
        // Since setState is async, we can't just call saveProduct() immediately with state.
        // We will modify formData directly for the retry call logic if we refactored saveProduct to accept data.
        // But simpler: update state, and just re-call save logic with patched internal data or just wait?
        // Let's manually update formData state AND call save with the NEW slug override if we change saveProduct to accept override.
        // Or simpler: Just update state and use a timeout/effect? No.

        // Best approach: Modifying saveProduct to accept an optional data override object would be cleanest,
        // but let's just update formData and then call a modified internal save helper.
        // Actually, easiest is to setFormData and then trigger specific logic.

        // Let's implement immediate recursive call with patched data:
        // We will pass the new slug to saveProduct? No, saveProduct reads from state.

        // Let's update state and blindly try again? No, state update is slow.
        // Let's manually path it in the object we send?
        // We need to refactor saveProduct slightly or duplicate the Logic?
        // Refactoring saveProduct to use current `formData` from CLOSURE vs State is tricky.

        // Let's do this:
        setFormData(prev => ({ ...prev, slug: newSlug }));

        // Hacky but works: We need to wait for state update? or just push the new slug into the request?
        // Let's use a specialized effect or just pass "overrideSlug" to saveProduct?
        // Let's add an argument to saveProduct: `overrideData = null`
        saveProduct(pendingSaveRedirect, { slug: newSlug });
        setSlugModalOpen(false);
    };


    const [isSlugDirty, setIsSlugDirty] = useState(false);

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w-]+/g, '')  // Remove all non-word chars
            .replace(/--+/g, '-');    // Replace multiple - with single -
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // If user manually edits slug, mark it as dirty
        if (name === 'slug') {
            setIsSlugDirty(true);
        }

        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Auto-generate slug from name if:
            // 1. We are changing the name
            // 2. The slug hasn't been manually edited (isSlugDirty is false)
            // 3. We are not in edit mode (optional, but usually safer to not change URLs of existing products)
            if (name === 'name' && !isSlugDirty && !isEdit) {
                newData.slug = slugify(value);
            }

            return newData;
        });
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
                original_price: formData.original_price,
                is_active: true,
                is_preorder: !!formData.is_preorder
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
        <form onSubmit={(e) => { e.preventDefault(); saveProduct(true); }} onKeyDown={handleKeyDown} className="space-y-8">
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
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => saveProduct(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isEdit ? 'Update & Stay' : 'Save & Stay'}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => saveProduct(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isEdit ? 'Update & Back' : 'Save & Back'}
                    </button>
                </div>
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
                            <div className="flex gap-2">
                                <label className="cursor-pointer text-sm text-gray-600 hover:text-black font-medium flex items-center gap-1">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const csv = event.target.result;
                                                const lines = csv.split('\n');
                                                const newSpecs = [];

                                                lines.forEach(line => {
                                                    // Simple CSV parse: assume key,value format
                                                    const [key, ...values] = line.split(',');
                                                    if (key && values.length > 0) {
                                                        const value = values.join(',').trim().replace(/^"|"$/g, ''); // Handle quoted values vaguely
                                                        const cleanKey = key.trim().replace(/^"|"$/g, '');
                                                        if (cleanKey) {
                                                            newSpecs.push({ key: cleanKey, value: value });
                                                        }
                                                    }
                                                });

                                                setSpecs([...specs, ...newSpecs]);
                                                // Sync immediately
                                                const specsObj = [...specs, ...newSpecs].reduce((acc, curr) => {
                                                    if (curr.key) acc[curr.key] = curr.value;
                                                    return acc;
                                                }, {});
                                                setFormData(prev => ({ ...prev, specifications: JSON.stringify(specsObj) }));
                                            };
                                            reader.readAsText(file);
                                            e.target.value = ''; // Reset input
                                        }}
                                    />
                                    Import CSV
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setSpecs([...specs, { key: '', value: '' }])}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Spec
                                </button>
                            </div>
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
                                    value={formData.category_id || ''}
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
                                    value={formData.brand_id || ''}
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
                                    value={formData.price || ''}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    onKeyDown={(evt) => ["e", "E", "+", "-", ",", "."].includes(evt.key) && evt.preventDefault()}
                                    step="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                <input
                                    type="number"
                                    name="original_price"
                                    value={formData.original_price || ''}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    onKeyDown={(evt) => ["e", "E", "+", "-", ",", "."].includes(evt.key) && evt.preventDefault()}
                                    step="1"
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

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="is_preorder"
                                    checked={formData.is_preorder}
                                    onChange={handleChange}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Pre-order</span>
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
                                    <th className="px-4 py-3">Original Price</th>
                                    <th className="px-4 py-3">Image</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">SKU</th>
                                    <th className="px-4 py-3">Pre-order</th>
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
                                                step="1"
                                                onKeyDown={(e) => {
                                                    if (e.key === '.' || e.key === ',') e.preventDefault();
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={variant.original_price || ''}
                                                onChange={(e) => handleVariantChange(index, 'original_price', e.target.value)}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                step="1"
                                                onKeyDown={(e) => {
                                                    if (e.key === '.' || e.key === ',') e.preventDefault();
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            {variant.image ? (
                                                <div className="flex items-center gap-2">
                                                    <img src={variant.image} alt="Variant" className="w-8 h-8 object-cover rounded" />
                                                    <button type="button" onClick={() => handleVariantChange(index, 'image', null)} className="text-red-500 text-xs">Remove</button>
                                                </div>
                                            ) : (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            handleVariantChange(index, 'image_file', file);
                                                            // Preview
                                                            handleVariantChange(index, 'image', URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    className="text-xs"
                                                />
                                            )}
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
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!variant.is_preorder}
                                                onChange={(e) => handleVariantChange(index, 'is_preorder', e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500"
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

            <ErrorModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ isOpen: false, errors: null })}
                errors={errorModal.errors}
            />

            <DuplicateSlugModal
                isOpen={slugModalOpen}
                onClose={() => setSlugModalOpen(false)}
                onSaveAnyway={handleSaveAnyway}
                slug={formData.slug}
            />
        </form >
    );
}
