'use client';

import { useState } from 'react';
import { Upload, X, Copy, Check } from 'lucide-react';

export default function MediaPage() {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        // Simulate upload - in real app, use FormData and API
        setTimeout(() => {
            const newImages = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                url: URL.createObjectURL(file),
                name: file.name
            }));
            setImages([...images, ...newImages]);
            setUploading(false);
        }, 1000);
    };

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Media Library</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Click or drag images to upload</p>
                    <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG, WebP</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={() => copyToClipboard(img.url, img.id)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                title="Copy URL"
                            >
                                {copiedId === img.id ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Copy className="h-4 w-4 text-gray-900" />
                                )}
                            </button>
                            <button
                                onClick={() => setImages(images.filter(i => i.id !== img.id))}
                                className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                title="Delete"
                            >
                                <X className="h-4 w-4 text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
