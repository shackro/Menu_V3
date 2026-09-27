import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { getCmsImageUrl } from '@/api/cms';

export default function MenuItemCard({ item }) {
  const gallery = Array.isArray(item.images) ? item.images : [];
  const imageData = item.image || gallery[0] || null;
  const hasMultipleImages = gallery.length > 1 || (item.image && gallery.length > 0);
  const primaryImage = imageData ? getCmsImageUrl(imageData, 'thumbnail') : undefined;

  const spiceEmojis = { mild: '🌶️', medium: '🌶️🌶️', hot: '🌶️🌶️🌶️' };

  return (
    <Link to={`/dish/${item.documentId || item.id}`} className="block h-full">
      <motion.div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 h-full flex flex-col">
        
        {/* Image Area */}
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={primaryImage} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          
          {/* Status Badge */}
          {item.status_badge === 'best_seller' && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              🔥 Best Seller
            </span>
          )}
          {item.status_badge === 'chefs_choice' && (
            <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              ⭐ Chef's Choice
            </span>
          )}

          {/* Multi-Image Indicator Dot */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              <div className="w-4 h-1.5 rounded-full bg-white shadow-sm" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <span className="text-xl font-bold text-primary whitespace-nowrap ml-2">
              KES {item.price.toLocaleString()}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
            {item.description}
          </p>

          {/* Dietary Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {item.is_halal && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                ☪️ Halal
              </span>
            )}
            {item.is_vegetarian && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Veg
              </span>
            )}
          </div>

          {/* Spice Level */}
          {item.spice_level && item.spice_level !== 'none' && spiceEmojis[item.spice_level] && (
            <div className="text-sm flex items-center gap-1 mt-auto">
              <span>{spiceEmojis[item.spice_level]}</span> 
              <span className="text-xs text-gray-500 capitalize">{item.spice_level}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}