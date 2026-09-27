import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function DishImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // images is guaranteed to be a valid array with at least 1 item thanks to getDishImages
  const safeImages = Array.isArray(images) && images.length > 0 
    ? images 
    : [{ url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', label: 'Default' }];

  const hasMultiple = safeImages.length > 1;
  const currentImage = safeImages[currentIndex] || safeImages[0];

  const goToNext = () => setCurrentIndex(prev => (prev + 1) % safeImages.length);
  const goToPrev = () => setCurrentIndex(prev => (prev - 1 + safeImages.length) % safeImages.length);

  return (
    <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-gray-200 dark:bg-gray-800 group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          src={currentImage.url}
          alt={`Dish view ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
          onError={(e) => {
            // If the image URL is broken, fall back to the placeholder
            e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';
          }}
        />
      </AnimatePresence>

      {/* Navigation Arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {safeImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Count Badge */}
      {hasMultiple && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <Maximize2 className="w-3 h-3" /> {currentIndex + 1}/{safeImages.length}
        </div>
      )}
    </div>
  );
}