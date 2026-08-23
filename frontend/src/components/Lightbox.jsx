import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ image, images, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  const currentIndex = images.findIndex((img) => img.id === image.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      {/* Image */}
      <div className="max-w-5xl max-h-[90vh] w-full mx-4">
        <img
          src={image.image_url}
          alt={image.title}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* Image Info */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div className="inline-block bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg">
          <span className="text-gold text-sm font-medium">{image.tag}</span>
          <h3 className="text-white font-serif font-bold text-lg mt-1">
            {image.title}
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
