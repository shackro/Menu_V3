import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCmsImageUrl } from '@/api/cms';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function DishImageGallery({ images }) {
  // Normalize images to a clean array of { url, label }
  const normalizeImages = (imgData) => {
    if (!imgData) {
      return [{ url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', label: 'Default' }];
    }
    
    if (Array.isArray(imgData)) {
      return imgData.map(img => ({
        url: getCmsImageUrl(img, 'large'),
        label: img.label || 'Main View'
      }));
    }
    
    return [{ 
      url: getCmsImageUrl(imgData, 'large'), 
      label: 'Main View' 
    }];
  };

  const normalizedImages = normalizeImages(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    const newIndex = (currentIndex + newDirection + normalizedImages.length) % normalizedImages.length;
    setCurrentIndex(newIndex);
    setPage([newIndex, newDirection]);
  };

  // Classic fade and slide transformation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] bg-gray-200 dark:bg-gray-800 overflow-hidden group select-none">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          // ✅ SWIPE / DRAG FUNCTIONALITY
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(e, info) => {
            // Swipe left (negative offset) -> Next image
            if (info.offset.x < -50) {
              paginate(1);
            } 
            // Swipe right (positive offset) -> Previous image
            else if (info.offset.x > 50) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* pointer-events-none prevents the image from blocking the drag gesture */}
          <img
            src={normalizedImages[currentIndex].url}
            alt={normalizedImages[currentIndex].label}
            className="w-full h-full object-cover pointer-events-none"
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (only show if more than 1 image) */}
      {normalizedImages.length > 1 && (
        <>
          <button 
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {normalizedImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const newDir = idx > currentIndex ? 1 : -1;
                  setCurrentIndex(idx);
                  setPage([idx, newDir]);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-1.5 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Image Counter Badge */}
      {normalizedImages.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          {currentIndex + 1} / {normalizedImages.length}
        </div>
      )}
    </div>
  );
}