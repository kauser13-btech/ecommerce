'use client';

import { AlertTriangle, X, Loader2 } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, isLoading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{message}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
