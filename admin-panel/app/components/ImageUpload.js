'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Monitor, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/app/lib/api';

export default function ImageUpload({
    value,
    onChange,
    multiple = false,
    label = "Upload Image",
    helpText = "PNG, JPG, GIF up to 2MB",
    maxSize = 2 * 1024 * 1024 // 2MB default
}) {
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('computer'); // 'computer' | 'library'
    const [dragActive, setDragActive] = useState(false);

    // Media Library State
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState([]);

    // Normalize value to array for consistent handling if multiple
    const images = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

    const validateFile = (file) => {
        if (file.size > maxSize) {
            toast.error(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
            return false;
        }

        // Optional: Check mime type if strictly required, but accept="image/*" handles most.
        // Let's rely on accept prop for type, but strict size check here.
        return true;
    };

    const fetchMedia = async () => {
        if (mediaFiles.length > 0) return; // Cache basically
        setMediaLoading(true);
        try {
            const res = await api.get('/media');
            // Ensure we handle array response
            const files = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setMediaFiles(files);
        } catch (error) {
            console.error('Failed to fetch media', error);
            toast.error('Failed to load media library');
        } finally {
            setMediaLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        processFiles(files);
        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processFiles = (files) => {
        const validFiles = files.filter(validateFile);

        if (validFiles.length > 0) {
            if (multiple) {
                onChange([...images, ...validFiles]);
            } else {
                onChange(validFiles[0]);
            }
            setIsModalOpen(false);
            toast.success('Image added successfully');
        }
    };

    const handleRemove = (index) => {
        if (multiple) {
            const newImages = [...images];
            newImages.splice(index, 1);
            onChange(newImages);
        } else {
            onChange(null);
        }
    };

    // Drag and Drop Handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };


    // Helper to render preview
    const renderPreview = (item, index) => {
        let url = '';
        let isFile = false;

        if (item instanceof File) {
            url = URL.createObjectURL(item);
            isFile = true;
        } else if (typeof item === 'string') {
            url = item;
        }

        return (
            <div key={index} className="relative group w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {url ? (
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <ImageIcon size={24} />
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 hover:scale-100 shadow-sm"
                    title="Remove"
                >
                    <X size={12} />
                </button>
                {isFile && (
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 backdrop-blur-sm text-white text-[10px] px-1 py-0.5 truncate text-center font-medium">
                        New File
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
                {images.map((img, idx) => renderPreview(img, idx))}

                {/* Upload Button */}
                {(multiple || images.length === 0) && (
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-600 group"
                    >
                        <div className="p-2 bg-gray-50 rounded-full group-hover:bg-white transition-colors mb-1">
                            <Upload size={20} />
                        </div>
                        <span className="text-xs font-medium">Upload</span>
                    </button>
                )}
            </div>

            {(multiple || images.length === 0) && helpText && (
                <p className="text-xs text-gray-500">{helpText}</p>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 flex-shrink-0">
                            <button
                                type="button"
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'computer'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => setActiveTab('computer')}
                            >
                                <Monitor size={16} />
                                From Computer
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'library'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => {
                                    setActiveTab('library');
                                    fetchMedia();
                                }}
                            >
                                <ImageIcon size={16} />
                                Media Library
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            {activeTab === 'computer' && (
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all h-full flex flex-col items-center justify-center ${dragActive
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple={multiple}
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-3 rounded-full ${dragActive ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                            <Upload size={24} />
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-blue-600 font-medium hover:text-blue-700"
                                            >
                                                Click to upload
                                            </button>
                                            <span className="text-gray-500"> or drag and drop</span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            PNG, JPG or GIF (Max 2MB)
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'library' && (
                                <div className="space-y-4">
                                    {mediaLoading ? (
                                        <div className="flex justify-center py-12">
                                            <Loader2 size={32} className="animate-spin text-blue-600" />
                                        </div>
                                    ) : mediaFiles.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                                            <p>No images found in library</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                            {mediaFiles.map((media, idx) => {
                                                const isSelected = selectedMedia.includes(media.url);
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            if (multiple) {
                                                                setSelectedMedia(prev =>
                                                                    prev.includes(media.url) ? prev.filter(u => u !== media.url) : [...prev, media.url]
                                                                );
                                                            } else {
                                                                // Single mode: select immediately and clear others (or just keep one)
                                                                setSelectedMedia([media.url]);
                                                            }
                                                        }}
                                                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 group ${isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                                                    >
                                                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                                                        {isSelected && (
                                                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                                                <div className="bg-blue-600 text-white rounded-full p-1 shadow-sm">
                                                                    <Check size={12} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {media.name}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4 border-t border-gray-100 mt-4 sticky bottom-0 bg-white">
                                        <button
                                            type="button"
                                            disabled={selectedMedia.length === 0}
                                            onClick={() => {
                                                if (multiple) {
                                                    onChange([...images, ...selectedMedia]);
                                                } else {
                                                    onChange(selectedMedia[0]);
                                                }
                                                setIsModalOpen(false);
                                                setSelectedMedia([]);
                                                toast.success('Images selected from library');
                                            }}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Check size={16} />
                                            Use Selected ({selectedMedia.length})
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
