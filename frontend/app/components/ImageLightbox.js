'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageLightbox({ images, initialIndex = 0, isOpen, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Sync internal state with prop when modal opens/changes
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

    const handleNext = useCallback((e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback((e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
    }, [isOpen, onClose, handleNext, handlePrev]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center fade-in duration-200"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/20 hover:bg-black/40 rounded-full"
                        onClick={handlePrev}
                    >
                        <ChevronLeft size={40} />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/20 hover:bg-black/40 rounded-full"
                        onClick={handleNext}
                    >
                        <ChevronRight size={40} />
                    </button>
                </>
            )}

            {/* Image Container */}
            <div
                className="relative w-full h-full p-4 flex items-center justify-center max-w-7xl mx-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area/controls
            >
                {/* Main Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={images[currentIndex]}
                        alt={`Product image ${currentIndex + 1}`}
                        className="max-w-full max-h-[90vh] object-contain select-none"
                    />
                </div>

                {/* Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
}

// Add imports at top
import { useState } from 'react';
