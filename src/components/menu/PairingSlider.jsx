import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { getCmsImageUrl } from '@/api/cms';
import { formatKES } from '@/utils/format';
import { useCartStore } from '@/store/useCart';
import { useState } from 'react';

export default function PairingSlider({ addons, mainDishId }) {
  const addAddon = useCartStore((state) => state.addAddon);
  const [addedIds, setAddedIds] = useState([]);

  if (!addons || addons.length === 0) return null;

  const handleAdd = (addon) => {
    addAddon(mainDishId, {
      dishId: addon.documentId,
      name: addon.name,
      price: addon.price,
      image: getCmsImageUrl(addon.image)
    });
    
    // Visual feedback
    setAddedIds(prev => [...prev, addon.documentId]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== addon.documentId));
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-primary">🔥</span> Goes Well With
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
        {addons.map((addon) => {
          const isAdded = addedIds.includes(addon.documentId);
          
          return (
            <motion.div 
              key={addon.documentId}
              whileHover={{ y: -3 }}
              className="flex-shrink-0 w-64 bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 snap-start flex p-3 gap-3 items-center"
            >
              {/* Small Product Image Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={getCmsImageUrl(addon.image)} 
                  alt={addon.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details & Add Button */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                  {addon.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {formatKES(addon.price)}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleAdd(addon)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                      isAdded 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary hover:bg-secondary text-white'
                    }`}
                    aria-label={`Add ${addon.name}`}
                    disabled={isAdded}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}