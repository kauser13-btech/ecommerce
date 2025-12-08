'use client';

import { X, AlertCircle } from 'lucide-react';

export default function ErrorModal({ isOpen, onClose, errors }) {
    if (!isOpen) return null;

    // Normalize errors to an array of strings
    let errorMessages = [];
    if (typeof errors === 'string') {
        errorMessages = [errors];
    } else if (Array.isArray(errors)) {
        errorMessages = errors;
    } else if (typeof errors === 'object' && errors !== null) {
        // Handle Laravel validation error format: { field: ["error1", "error2"] }
        Object.values(errors).forEach(err => {
            if (Array.isArray(err)) {
                errorMessages.push(...err);
            } else {
                errorMessages.push(String(err));
            }
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-red-50">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Validation Error
                    </h3>
                </div>

                <div className="p-6">
                    <div className="space-y-3">
                        {errorMessages.length > 0 ? (
                            errorMessages.map((msg, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    <span>{msg}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600">Something went wrong. Please try again.</p>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
