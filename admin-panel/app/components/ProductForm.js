'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { ChromePicker } from 'react-color';

import ErrorModal from './ErrorModal';
import DuplicateSlugModal from './DuplicateSlugModal';
import ImageUpload from './ImageUpload';
import { Loader2, Save, ArrowLeft, Trash2, Plus, X, Image as ImageIcon, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });




export default function ProductForm({ initialData, isEdit }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [tags, setTags] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [options, setOptions] = useState([]);
    const [errorModal, setErrorModal] = useState({ isOpen: false, errors: null });
    const [slugModalOpen, setSlugModalOpen] = useState(false);
    const [openColorPicker, setOpenColorPicker] = useState(null);
    const [pendingSaveRedirect, setPendingSaveRedirect] = useState(null);
    const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
    const [tagSearch, setTagSearch] = useState('');
    const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
    const [newAttributeName, setNewAttributeName] = useState('');

    const [images, setImages] = useState([]); // Unified state: { type: 'existing'|'new', url: string, file?: File }
    const [specs, setSpecs] = useState([]);

    // Product Colors State
    const [productColors, setProductColors] = useState([]); // [{ name: '', image: '', image_file: null }]

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sku: '',
        description: '',
        price: '',
        original_price: '',
        stock: '0',
        category_id: '',
        brand_id: '',
        tags: [],
        image: '',
        is_active: true,
        is_featured: false,
        is_new: false,
        is_preorder: false,
        features: '',
        is_new: false,
        is_preorder: false,
        features: '',
        specifications: '{}',
        product_colors: []
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
                tags: initialData.tags ? initialData.tags.map(t => t.id) : [],
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
            if (initialData.product_colors) {
                // Ensure array
                try {
                    const pcs = typeof initialData.product_colors === 'string' ? JSON.parse(initialData.product_colors) : initialData.product_colors;
                    if (Array.isArray(pcs)) {
                        setProductColors(pcs.map(c => ({ ...c, image_file: null })));
                    }
                } catch (e) { console.error("Error parsing product_colors", e); }
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
            const [catsRes, brandsRes, tagsRes, attrsRes] = await Promise.all([
                api.get('/categories'),
                api.get('/brands'),
                api.get('/tags'),
                api.get('/attributes')
            ]);
            setCategories(catsRes.data.data || catsRes.data);
            setBrands(brandsRes.data.data || brandsRes.data);
            setTags(tagsRes.data.data || tagsRes.data);
            setAttributes(attrsRes.data.data || attrsRes.data);
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
        // SKU is auto-generated now, no validation needed unless we want to check uniqueness which backend does
        // if (!data.sku) errors.sku = 'Please provide a unique SKU';

        // Remove HTML tags to check if description is empty
        const cleanDescription = data.description?.replace(/<[^>]+>/g, '').trim();
        if (!cleanDescription) errors.description = 'Please add a product description';

        if (images.length === 0) {
            errors.images = 'Please upload at least one image for the product';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/media', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    };

    const saveProduct = async (shouldRedirect = true, overrideData = null) => {
        // Use override data for validation if provided, merging with current state
        let dataToSubmit = overrideData ? { ...formData, ...overrideData } : formData;

        // Auto-generate SKU if missing
        if (!dataToSubmit.sku) {
            const baseSku = slugify(dataToSubmit.name).toUpperCase().substring(0, 10);
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            dataToSubmit.sku = `${baseSku}-${random}`;
            // Update state too so it reflects in UI if we stay on page
            setFormData(prev => ({ ...prev, sku: dataToSubmit.sku }));
        }

        const errors = validate(dataToSubmit);
        if (errors) {
            setErrorModal({ isOpen: true, errors: Object.values(errors) });
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Processing product...');

        try {
            // 1. Upload Images First
            const uploadedImages = [];

            // Main Images
            toast.loading('Uploading main images...', { id: toastId });
            for (const img of images) {
                if (img.type === 'new' && img.file) {
                    try {
                        const url = await uploadFile(img.file);
                        uploadedImages.push(url);
                    } catch (uploadError) {
                        console.error("Failed to upload image", img, uploadError);
                        toast.error(`Failed to upload ${img.file.name}`, { id: toastId });
                        setLoading(false);
                        return;
                    }
                } else {
                    uploadedImages.push(img.url);
                }
            }

            // Product Colors Images
            const processedColors = [...productColors];
            if (processedColors.length > 0) {
                toast.loading('Uploading color images...', { id: toastId });
                for (let i = 0; i < processedColors.length; i++) {
                    if (processedColors[i].image_file) {
                        try {
                            const url = await uploadFile(processedColors[i].image_file);
                            processedColors[i].image = url;
                            processedColors[i].image_file = null; // Clear file after upload
                        } catch (error) {
                            console.error("Failed to upload color image", error);
                            toast.error("Failed to upload a color image", { id: toastId });
                            setLoading(false);
                            return;
                        }
                    }
                }
            }

            // Variant Images
            const processedVariants = [...variants];
            // Only upload if variant has a SPECIFIC image file that differs (if applicable logic exists)
            // Currently variants usually inherit or link, but if they have image_file:
            if (processedVariants.length > 0) {
                toast.loading('Uploading variant images...', { id: toastId });
                for (let i = 0; i < processedVariants.length; i++) {
                    if (processedVariants[i].image_file) {
                        try {
                            const url = await uploadFile(processedVariants[i].image_file);
                            // Check where to store it. 'image' field in variant?
                            // Frontend state might differ, let's assume 'image' property.
                            processedVariants[i].image = url;
                            processedVariants[i].image_file = null;
                        } catch (error) {
                            console.error("Failed to upload variant image", error);
                            toast.error("Failed to upload a variant image", { id: toastId });
                            setLoading(false);
                            return;
                        }
                    }
                }
            }

            // 2. Prepare JSON Payload
            toast.loading('Saving product data...', { id: toastId });

            const payload = {
                ...dataToSubmit,
                images: uploadedImages,
                image: uploadedImages.length > 0 ? uploadedImages[0] : null, // Main thumbnail
                product_colors: JSON.stringify(processedColors.map(c => ({
                    name: c.name,
                    image: c.image,
                    code: c.code
                }))),
                variants: JSON.stringify(processedVariants),
                options: JSON.stringify(options),

                // Ensure Boolean conversion if backend needs it (though JSON true/false is usually fine for Laravel with casts, 
                // but checking original logic which used '1'/'0')
                is_active: dataToSubmit.is_active ? true : false,
                is_featured: dataToSubmit.is_featured ? true : false,
                is_new: dataToSubmit.is_new ? true : false,
                is_preorder: dataToSubmit.is_preorder ? true : false,
                tags: dataToSubmit.tags,
            };

            // Clean up empty original_price
            if (!payload.original_price) {
                delete payload.original_price;
            }
            if (typeof payload.specifications === 'object') {
                payload.specifications = JSON.stringify(payload.specifications);
            }

            // Remove internal fields that shouldn't be sent
            delete payload.product_colors_files; // if any

            // For editing, we might need to send `existing_images` separately?
            // Actually, if we send `images` as an array of ALL URLs (existing + new), 
            // the ProductController logic for 'images' (which iterates files) needs to be checked.
            // Wait, ProductController's `store` method expects `images` to be FILES.
            // AND `existing_images` to be URLs.
            // We need to UPDATE ProductController to accept `images` as an array of Strings mixed? 
            // OR we just use `existing_images` for EVERYTHING since they are all URLs now?

            // Let's modify the payload to put ALL URLs into `existing_images` 
            // and send `images` as null/empty? 
            // Checking ProductController logic:
            // if ($request->has('existing_images')) { ... $finalImages = ... }
            // if ($request->hasFile('images')) { ... }
            // So if we send ALL URLs in `existing_images`, it essentially overwrites/sets the list.
            // The controller merges them safely? 
            // Controller: $finalImages = $existingInputs; ... append new files ... $data['images'] = $finalImages;
            // YES. So we should send ALL uploaded URLs as `existing_images`.

            payload.existing_images = uploadedImages;
            delete payload.images; // Don't send 'images' key or send empty

            let response;
            if (isEdit) {
                response = await api.put(`/products/${initialData.id}`, payload);
            } else {
                response = await api.post('/products', payload);
            }

            toast.success('Product saved successfully', { id: toastId });

            if (shouldRedirect) {
                router.push('/dashboard/products');
            } else {
                if (!isEdit && response?.data?.data?.id) {
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
            toast.error('Failed to save product', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAnyway = () => {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        const newSlug = `${formData.slug}-${randomSuffix}`;

        setFormData(prev => ({ ...prev, slug: newSlug }));
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

    const handleBlur = (e) => {
        if (e.target.name === 'slug' && !e.target.value) {
            setFormData(prev => ({ ...prev, slug: slugify(prev.name) }));
            setIsSlugDirty(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        // If user manually edits slug, mark it as dirty
        if (name === 'slug') {
            setIsSlugDirty(true);
            // Enforce slugify (allow trailing dash while typing)
            newValue = newValue
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-');
        }

        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: newValue
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
        } else if (field === 'name') {
            if (value === '__create_new__') {
                setIsAttributeModalOpen(true);
                return; // Don't set the value to __create_new__
            }

            // Validate that variation name is not "color" or "Colors" (case-insensitive)
            if (value.toLowerCase() === 'color' || value.toLowerCase() === 'colors') {
                toast.error('The variation name "color" is reserved. Please use the "Product Colors" feature to manage product colors.');
                return; // Don't update the state
            }
            newOptions[index][field] = value;
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

    const handleAddProductColor = () => {
        setProductColors([...productColors, { name: '', image: '', image_file: null, code: '#000000' }]);
    };

    const handleRemoveProductColor = (index) => {
        setProductColors(productColors.filter((_, i) => i !== index));
    };

    const handleProductColorChange = (index, field, value) => {
        const newColors = [...productColors];
        newColors[index][field] = value;
        setProductColors(newColors);
    };

    const generateVariants = () => {
        // Filter out empty options first
        const validOptions = options.filter(opt => opt.name && opt.values.length > 0);

        let dimensions = validOptions;
        let colorValues = [];

        if (productColors.length > 0) {
            // Verify if 'Color' option already exists? 
            // The prompt implies we replace generic Color logic or integrate.
            // "Variations should be generated as a combination of each available COLOR ... and each of its OTHER existing... attributes."
            // So we take productColors names as the 'Color' dimension.
            colorValues = productColors.map(c => c.name).filter(Boolean);

            // If user also added a generic 'Color' option in the list, we probably should override/ignore or warn?
            // For safety, let's treat productColors as THE source for Color dimension.
            // We'll create a synthetic dimension for calculations.

            // Remove any existing 'Color' option from manual options to avoid duplicate/conflict
            dimensions = dimensions.filter(d => d.name.toLowerCase() !== 'color');

            // Prepend Colors dimension
            if (colorValues.length > 0) {
                // Add to beginning
                const colorDim = { name: 'Color', values: colorValues };
                dimensions = [colorDim, ...dimensions];
            }
        }

        if (dimensions.length === 0) return;

        const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
        const combinations = dimensions.length === 1
            ? dimensions[0].values.map(v => [v])
            : cartesian(...dimensions.map(d => d.values));

        const newVariants = combinations.map(combo => {
            const attributes = {};
            let colorName = null;

            combo.forEach((val, idx) => {
                const dimName = dimensions[idx].name;
                attributes[dimName] = val;
                if (dimName === 'Color') colorName = val;
            });

            // Generate SKU
            const skuSuffix = combo.join('-').toUpperCase().replace(/[^A-Z0-9-]/g, '');

            // Resolve Image
            // "Variations must not store a copy ... reference matched color object"
            // However, visually in ADMIN table, we might want to show it?
            // User says "Variations must REFERENCE... dynamically from parent".
            // So we don't save 'image' in database for variant? Or we save it as cache?
            // Requirement: "Variations must not store a copy... Instead... reference".
            // So we should NOT set variant.image hardcoded if it comes from Color.
            // But wait, what if variant image is DIFFERENT? (e.g. Red Small specific image?)
            // Requirement says "If administrator updates color image... all variations... must automatically display new image".
            // This implies we should propagate it OR leave variant image empty and resolve at runtime.
            // But for standard variants (Size), the image IS the color image.

            // Let's set variation_color_name.
            // And Visual preview in table can show the linked color image.

            return {
                attributes,
                price: formData.price,
                stock: formData.stock,
                sku: `${formData.sku || slugify(formData.name).toUpperCase()}-${skuSuffix}`,
                original_price: formData.original_price,
                is_active: true,
                is_preorder: !!formData.is_preorder,
                variation_color_name: colorName,
                image: null, // explicit null so it falls back to dynamic color lookup? 
                // Or should we prepopulate for convenience but not save?
                // The frontend/backend synchronization relies on `variation_color_name`.
            };
        });

        setVariants(newVariants);
        toast.success(`${newVariants.length} variants generated successfully.`);
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
                                onBlur={handleBlur}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* SKU Field Hidden - Auto Generated */}

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

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                <div
                                    className="min-h-[42px] p-1.5 border border-gray-300 rounded-lg flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 bg-white cursor-text"
                                    onClick={() => document.getElementById('tag-search-input')?.focus()}
                                >
                                    {(formData.tags || []).map(tagId => {
                                        const tag = tags.find(t => t.id === tagId);
                                        if (!tag) return null;
                                        return (
                                            <span key={tagId} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm border border-blue-100">
                                                {tag.name}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            tags: prev.tags.filter(id => id !== tagId)
                                                        }));
                                                    }}
                                                    className="hover:text-blue-900"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        );
                                    })}
                                    <input
                                        id="tag-search-input"
                                        type="text"
                                        placeholder={(formData.tags || []).length === 0 ? "Select tags..." : ""}
                                        className="flex-1 min-w-[100px] outline-none text-sm py-1 px-1 bg-transparent"
                                        onFocus={() => setTagsDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setTagsDropdownOpen(false), 200)}
                                        onChange={(e) => setTagSearch(e.target.value)}
                                        value={tagSearch}
                                    />
                                </div>

                                {tagsDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                        {tags.filter(tag =>
                                            !(formData.tags || []).includes(tag.id) &&
                                            tag.name.toLowerCase().includes(tagSearch.toLowerCase())
                                        ).length > 0 ? (
                                            tags
                                                .filter(tag =>
                                                    !(formData.tags || []).includes(tag.id) &&
                                                    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
                                                )
                                                .map(tag => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                tags: [...(prev.tags || []), tag.id]
                                                            }));
                                                            setTagSearch('');
                                                            document.getElementById('tag-search-input')?.focus();
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between group"
                                                    >
                                                        <span className="text-gray-700 group-hover:text-gray-900">{tag.name}</span>
                                                        <span className="text-xs text-gray-400 font-mono">{tag.slug}</span>
                                                    </button>
                                                ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                                {tags.length === 0 ? 'No tags created yet' : 'No matching tags found'}
                                            </div>
                                        )}
                                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                                            <button
                                                type="button"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    window.open('/dashboard/tags', '_blank');
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Plus size={14} /> Manage Tags
                                            </button>
                                        </div>
                                    </div>
                                )}
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



                </div>
            </div>

            {/* Variation Creator */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Product Colors */}
                <div className="bg-white p-6 lg:col-span-3 space-y-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Product Colors</h3>
                        <button
                            type="button"
                            onClick={handleAddProductColor}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Color
                        </button>
                    </div>
                    <div className="space-y-4">
                        {/* Header Row */}
                        {productColors.length > 0 && (
                            <div className="grid grid-cols-5 gap-4 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="col-span-1">Color Name</div>
                                <div className="col-span-1">Hex</div>
                                <div className="col-span-2">Image</div>
                                <div className="col-span-1"></div>
                            </div>
                        )}

                        {productColors.map((color, index) => {
                            const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(color.code || '');

                            return (
                                <div key={index} className="grid grid-cols-5 gap-4 items-start bg-gray-50 p-3 rounded-xl border border-gray-100 transition-all hover:shadow-md hover:border-gray-200">
                                    {/* Name Input */}
                                    <div className="col-span-1">
                                        <input
                                            type="text"
                                            placeholder="e.g. Midnight Blue"
                                            value={color.name}
                                            onChange={(e) => handleProductColorChange(index, 'name', e.target.value)}
                                            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 placeholder:font-normal"
                                        />
                                    </div>

                                    {/* Color Picker & Hex */}
                                    <div className="col-span-1 relative">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div
                                                    className="w-10 h-10 rounded-lg border-2 border-white shadow-sm ring-1 ring-gray-200 cursor-pointer hover:scale-105 transition-transform"
                                                    style={{ backgroundColor: isValidHex ? color.code : '#000000' }}
                                                    onClick={() => setOpenColorPicker(openColorPicker === index ? null : index)}
                                                    title="Click to pick color"
                                                />
                                                {openColorPicker === index && (
                                                    <div className="absolute top-12 left-0 z-50 animate-in fade-in zoom-in duration-200">
                                                        <div
                                                            className="fixed inset-0"
                                                            onClick={() => setOpenColorPicker(null)}
                                                        />
                                                        <div className="relative shadow-xl rounded-lg overflow-hidden">
                                                            <ChromePicker
                                                                color={isValidHex ? color.code : '#000000'}
                                                                onChange={(c) => handleProductColorChange(index, 'code', c.hex)}
                                                                disableAlpha={true}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    {/* Link from Gallery UI */}
                                    <div className="col-span-2 relative">
                                        {color.image ? (
                                            <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-gray-200">
                                                <div className="h-8 w-8 rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                    <img src={color.image} alt={color.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500 truncate">Linked from gallery</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleProductColorChange(index, 'image', null);
                                                        handleProductColorChange(index, 'image_file', null);
                                                    }}
                                                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                    title="Remove image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenColorPicker(openColorPicker === `image-${index}` ? null : `image-${index}`)}
                                                    className="flex items-center justify-between w-full h-10 px-3 transition bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:ring-2 hover:ring-blue-50"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                                        <span className="text-xs text-gray-600">Select from Gallery</span>
                                                    </div>
                                                    <ChevronDown size={14} className="text-gray-400" />
                                                </button>

                                                {/* Dropdown for Gallery Images */}
                                                {openColorPicker === `image-${index}` && (
                                                    <div className="absolute top-12 left-0 right-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-3 animate-in fade-in zoom-in duration-200 w-[280px]">
                                                        {images.length === 0 ? (
                                                            <p className="text-xs text-center text-gray-500 py-4">
                                                                No product images uploaded.<br />
                                                                Upload images in "Product Images" first.
                                                            </p>
                                                        ) : (
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {images
                                                                    .filter(img => {
                                                                        // Filter out images used by OTHER colors
                                                                        const isUsedByOther = productColors.some((c, i) => i !== index && c.image === img.url);
                                                                        return !isUsedByOther;
                                                                    })
                                                                    .map((img, imgIdx) => (
                                                                        <div
                                                                            key={imgIdx}
                                                                            onClick={() => {
                                                                                handleProductColorChange(index, 'image', img.url);
                                                                                // Ideally we check if it is a 'new' file type and set image_file too if needed, 
                                                                                // but 'image' url is enough for display and linking.
                                                                                // If we want backend to know which FILE it matches, we might need logic.
                                                                                // But usually backend matches by filename or we just send URL if it's existing. 
                                                                                // Since we are "Linking", existing URL is fine. 
                                                                                // For new files, the 'url' is blob, which backend won't know unless we upload it.
                                                                                // But the main 'images' array will handle uploading.
                                                                                // So we just need to ensure backend saves the 'image' string field of color.
                                                                                setOpenColorPicker(null);
                                                                            }}
                                                                            className="aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-100 transition-all"
                                                                            title="Use this image"
                                                                        >
                                                                            <img src={img.url} className="w-full h-full object-cover" />
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}
                                                        <div className="mt-2 pt-2 border-t border-gray-50 flex justify-end">
                                                            <button
                                                                onClick={() => setOpenColorPicker(null)}
                                                                className="text-xs text-gray-400 hover:text-gray-600"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Delete Action */}
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProductColor(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remove Color"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {productColors.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <div className="bg-white p-3 rounded-full shadow-sm w-fit mx-auto mb-3">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">No colors added yet</p>
                                <p className="text-xs text-gray-500 mt-1">Add specific colors to enable visual switching.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Variations */}
                <div className="bg-white p-6 lg:col-span-2 rounded-xl shadow-sm border border-gray-100 space-y-4">
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
                                <select
                                    value={option.name}
                                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Type</option>
                                    {attributes.map(attr => (
                                        <option key={attr.id} value={attr.name}>{attr.name}</option>
                                    ))}
                                    <option value="__create_new__" className="text-blue-600 font-medium">+ Create New Type</option>
                                </select>
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
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Pre-order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {Object.entries(variant.attributes).map(([k, v]) => `${v}`).join('-')}
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
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
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

            {/* Create Attribute Modal */}
            {isAttributeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Add New Variation Type</h3>
                            <button
                                type="button"
                                onClick={() => setIsAttributeModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type Name</label>
                                <input
                                    type="text"
                                    value={newAttributeName}
                                    onChange={(e) => setNewAttributeName(e.target.value)}
                                    placeholder="e.g. Material"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-1">This will be available for all products.</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAttributeModalOpen(false)}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={!newAttributeName.trim()}
                                    onClick={async () => {
                                        try {
                                            const res = await api.post('/attributes', { name: newAttributeName });
                                            setAttributes([...attributes, res.data]);
                                            setIsAttributeModalOpen(false);
                                            setNewAttributeName('');
                                            toast.success('Variation type added');
                                        } catch (err) {
                                            console.error(err);
                                            toast.error('Failed to add type. It might already exist.');
                                        }
                                    }}
                                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Type
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form >
    );
}
