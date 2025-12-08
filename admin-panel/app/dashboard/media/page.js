'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Copy, Check, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

export default function MediaPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    // Delete Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await api.get('/media');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching media:', error);
            toast.error('Failed to load media');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images[]', file);
        });

        try {
            // Note: We might need a specific upload endpoint or re-use product upload logic?
            // Actually, for a pure media library, we typically upload to a general folder.
            // But currently our backend logic usually attaches images to products.
            // For now, let's assuming we hook into the product upload logic or create a dedicated one.
            // Wait, looking at ProductController, it handles uploads directly.
            // I should have added a store method to MediaController for direct uploads.
            // Let's implement a simple direct upload in MediaController first?
            // User requested "show all uploaded images". 
            // The prompt "Implement Media Library (View All Uploaded Images)" implies viewing first.
            // The upload part on this page is "simulated" in the existing code.
            // I will implement a basic client-side filter for now or just skip upload implementation if strictly "View" was requested,
            // BUT existing page has upload UI. I should probably support it.
            // Let's stick to View + Delete first as explicitly requested "show all uploaded images".
            // I'll keep the upload UI but maybe stub it or implement if easy.
            // Actually, I'll comment out upload logic for now or make it functional if I add the endpoint.
            // Let's hold on upload for this specific step and focus on view/delete.
            toast.error("Direct upload not yet implemented on backend.");
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const confirmDelete = (img) => {
        setImageToDelete(img);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!imageToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete('/media', { data: { path: imageToDelete.path } });
            setImages(images.filter(i => i.path !== imageToDelete.path));
            toast.success('Image deleted successfully');
            setIsDeleteModalOpen(false);
            setImageToDelete(null);
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        } finally {
            setIsDeleting(false);
        }
    };

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setImageToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Image"
                message="Are you sure you want to delete this image? This might break products using it."
                isLoading={isDeleting}
            />

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

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => copyToClipboard(img.url, img.path)}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                    title="Copy URL"
                                >
                                    {copiedId === img.path ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-gray-900" />
                                    )}
                                </button>
                                <button
                                    onClick={() => confirmDelete(img)}
                                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <X className="h-4 w-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
