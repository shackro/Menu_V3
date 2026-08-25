import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchMenuItemByDocId, getCmsImageUrl } from '@/api/cms';
import DishImageGallery from '@/components/dish/DishImageGallery';
import { useCartStore } from '@/store/useCart';
import { formatKES } from '@/utils/format';
import { ArrowLeft, Plus, Minus, Check, MessageCircle } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import PairingSlider from '@/components/menu/PairingSlider';
import { useCurrency } from '@/context/CurrencyContext';

// Predefined common instructions for quick tapping
const COMMON_INSTRUCTIONS = [
  "Medium Rare", "Well Done", "No Onions", "Extra Sauce", 
  "Hot Chili", "No Salt", "Extra Cheese", "Dressing on Side", "Gluten-Free Bun"
];

export default function DishPage() {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const { format } = useCurrency();

  const [spice, setSpice] = useState('Mild');
  const [qty, setQty] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customNotes, setCustomNotes] = useState('');

  useEffect(() => {
    fetchMenuItemByDocId(id).then(data => {
      setDish(data);
      setLoading(false);
      if (data?.spice_level) {
        setSpice(data.spice_level.charAt(0).toUpperCase() + data.spice_level.slice(1));
      }
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen p-8 space-y-6">
      <Skeleton className="h-[50vh] w-full rounded-3xl" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
  
  if (!dish) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="text-6xl mb-4">🍽️</div>
      <h2 className="text-2xl font-bold mb-2">Dish not found</h2>
      <Link to="/menu" className="mt-4 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-secondary transition">Back to Menu</Link>
    </div>
  );

  // ✅ Normalize images to support both mockData's `images` array and CMS's `image` field
  const galleryImages = dish.images || (dish.image ? (Array.isArray(dish.image) ? dish.image : [{ url: typeof dish.image === 'string' ? dish.image : dish.image.url, label: 'Main' }]) : []);
  
  const displayPrice = format ? format(dish.price) : formatKES(dish.price);

  const toggleInstruction = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddToCart = () => {
    const finalInstructions = [...selectedTags, customNotes].filter(Boolean).join(', ');
    
    // Get the first image URL for the cart
    const cartImage = galleryImages.length > 0 ? getCmsImageUrl(galleryImages[0], 'medium') : undefined;

    addItem({
      dishId: dish.documentId,
      name: dish.name,
      price: dish.price,
      image: cartImage,
      quantity: qty,
      spiceLevel: spice,
      specialInstructions: finalInstructions,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark pb-32">
      {/* High-Res Image Gallery with Classic Fade/Slide Transformation */}
      <div className="relative">
        <DishImageGallery images={galleryImages} />
        <Link to="/menu" className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 transition active:scale-95">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white dark:bg-dark-card rounded-t-3xl p-6 md:p-8 shadow-2xl border-t border-gray-100 dark:border-gray-800">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{dish.name}</h1>
            <span className="text-2xl font-bold text-primary">{displayPrice}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{dish.description}</p>

          {/* Allergen / Dietary Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {dish.is_halal && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                ☪️ Halal
              </span>
            )}
            {dish.is_vegetarian && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                🌱 Vegetarian
              </span>
            )}
            {dish.is_vegan && (
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                🌿 Vegan
              </span>
            )}
          </div>

          {/* Inclusions */}
          {dish.inclusions && dish.inclusions.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-dark rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Includes:
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.inclusions.map((inc, i) => (
                  <span key={i} className="bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm">
                    {inc.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Smart Pairings */}
          {dish.suggested_addons && dish.suggested_addons.length > 0 && (
            <PairingSlider addons={dish.suggested_addons} mainDishId={dish.documentId} />
          )}

          {/* Customization Section */}
          <div className="mt-8 space-y-5">
            
            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 dark:text-white">Quantity</span>
              <div className="flex items-center gap-4 bg-gray-100 dark:bg-dark rounded-full px-2 py-1 border border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))} 
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 font-bold text-xl active:scale-95"
                >
                  -
                </button>
                <span className="font-bold w-8 text-center text-lg">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 font-bold text-xl active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Quick Instruction Chips */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Common Requests
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {COMMON_INSTRUCTIONS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <motion.button
                      key={tag}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleInstruction(tag)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                          : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {tag}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes Textarea */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" /> Special Instructions
              </label>
              <textarea 
                placeholder="Anything else? (e.g., allergic to nuts, specific plating requests...)" 
                value={customNotes} 
                onChange={(e) => setCustomNotes(e.target.value)} 
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm transition-all" 
                rows={3} 
              />
            </div>

          </div>

          {/* Add to Cart Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={handleAddToCart} 
            className="w-full mt-8 py-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
          >
            Add to Order • {format ? format(dish.price * qty) : formatKES(dish.price * qty)}
          </motion.button>
          
        </div>
      </div>
    </div>
  );
}