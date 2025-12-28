'use client';

import { X, AlertTriangle } from 'lucide-react';

export default function DuplicateSlugModal({ isOpen, onClose, onSaveAnyway, slug }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-amber-50">
                    <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="text-lg font-semibold">Duplicate Slug Detected</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 mb-4">
                        The slug <span className="font-mono bg-gray-100 px-1 rounded text-gray-800">{slug}</span> is already in use by another product.
                    </p>
                    <p className="text-gray-600 mb-6">
                        Would you like to automatically append random characters to make it unique and save anyway?
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSaveAnyway}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Save Anyway
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
