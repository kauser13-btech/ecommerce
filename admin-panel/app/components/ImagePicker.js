'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import api from '@/app/lib/api';

export default function ImagePicker({ value, onChange }) {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'library'
    const [libraryImages, setLibraryImages] = useState([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (activeTab === 'library' && libraryImages.length === 0) {
            fetchLibrary();
        }
    }, [activeTab]);


    const fetchLibrary = async () => {
        setLoadingLibrary(true);
        try {
            const response = await api.get('/media');
            setLibraryImages(response.data);
        } catch (error) {
            console.error('Error loading library:', error);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onChange(response.data.url);
            setActiveTab('preview'); // Or keep on upload but show success?
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'bg-white text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    <Upload size={16} /> Upload
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('library')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'library' ? 'bg-white text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    <ImageIcon size={16} /> Library
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'upload' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors relative bg-gray-50/50">
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                                <span className="text-gray-500">Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">Click to upload image</p>
                                <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP</p>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'library' && (
                    <div>
                        {loadingLibrary ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {libraryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => onChange(img.url)}
                                        className={`relative aspect-square rounded-lg border overflow-hidden group transition-all ${value === img.url ? 'ring-2 ring-blue-600 border-transparent' : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <img src={img.url} alt="Library" className="w-full h-full object-cover" />
                                        {value === img.url && (
                                            <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                                                <div className="bg-blue-600 text-white rounded-full p-1">
                                                    <Check size={12} />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                                {libraryImages.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-gray-400 text-sm">
                                        No images found in library
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Preview Area */}
                {value && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Selected Image</p>
                        <div className="relative inline-block border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <img src={value} alt="Selected" className="h-32 w-auto object-contain" />
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
