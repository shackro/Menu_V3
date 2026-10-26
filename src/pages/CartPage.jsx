import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCart';
import { formatKES } from '@/utils/format';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const tableId = useCartStore((state) => state.tableId);
  const setTableId = useCartStore((state) => state.setTableId);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const emptyCart = useCartStore((state) => state.emptyCart);
  const getTotal = useCartStore((state) => state.getTotal);
  
  const [localTableId, setLocalTableId] = useState(tableId || '');
  const [confirmEmptyCart, setConfirmEmptyCart] = useState(false);

  const handleTableIdChange = (e) => {
    const val = e.target.value;
    setLocalTableId(val);
    setTableId(val);
  };

  // ================= EMPTY CART ANIMATION =================
  if (items.length === 0) {
    const flyingFoods = [
      { icon: '🍔', x: -120, y: -120, rotate: -20 },
      { icon: '🍕', x: 120, y: -120, rotate: 20 },
      { icon: '', x: -120, y: 120, rotate: -15 },
      { icon: '🍹', x: 120, y: 120, rotate: 15 },
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-dark overflow-hidden">
        
        {/* Animation Container */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          {/* Central Plate / Table */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full bg-white dark:bg-dark-card border-4 border-dashed border-primary/30 flex items-center justify-center shadow-lg z-10"
          >
            <span className="text-4xl">🍽️</span>
          </motion.div>

          {/* Flying Food Items */}
          {flyingFoods.map((food, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl"
              initial={{ x: food.x, y: food.y, opacity: 0, scale: 0.5, rotate: food.rotate }}
              animate={{
                x: 0,
                y: 0,
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.8],
                rotate: 0,
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.6,
                ease: "easeInOut",
              }}
            >
              {food.icon}
            </motion.div>
          ))}
        </div>

        {/* Instructional Text & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
            Browse our delicious menu and tap the <span className="text-primary font-bold text-lg">+</span> button to add your favorites here!
          </p>
          
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Browse Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }
  // ========================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark pb-32">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/menu" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>

        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Your Order</h1>
          <button
            type="button"
            onClick={() => setConfirmEmptyCart(true)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4" /> Empty cart
          </button>
        </div>

        {confirmEmptyCart && (
          <div role="alertdialog" aria-label="Confirm empty cart" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-semibold">Remove every item from your cart?</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirmEmptyCart(false)} className="rounded-lg px-3 py-2 text-xs font-bold hover:bg-current/10">
                Keep items
              </button>
              <button
                type="button"
                onClick={() => {
                  emptyCart();
                  setConfirmEmptyCart(false);
                }}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                Empty cart
              </button>
            </div>
          </div>
        )}

        {/* Table Number Input (if not set via QR) */}
        {!tableId && (
          <div className="mb-6 bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <label className="block text-sm font-bold mb-2">Table Number (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g., 12" 
              value={localTableId} 
              onChange={handleTableIdChange}
              className="w-full p-3 bg-gray-100 dark:bg-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item, idx) => (
            <motion.div 
              key={`${item.dishId}-${item.spiceLevel}-${idx}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.spiceLevel} • {formatKES(item.price)} each</p>
                </div>
                <button onClick={() => removeItem(item.dishId, item.spiceLevel)} className="text-gray-400 hover:text-red-500 p-1">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Addons */}
              {item.addons && item.addons.length > 0 && (
                <div className="ml-4 mb-3 space-y-1">
                  {item.addons.map((addon, aIdx) => (
                    <p key={aIdx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="text-primary">+</span> {addon.quantity}x {addon.name} (+{formatKES(addon.price * addon.quantity)})
                    </p>
                  ))}
                </div>
              )}

              {item.specialInstructions && (
                <p className="text-xs text-gray-500 italic mb-3"> "{item.specialInstructions}"</p>
              )}

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-dark rounded-full px-2 py-1">
                  <button onClick={() => updateQuantity(item.dishId, item.spiceLevel, -1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.dishId, item.spiceLevel, 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Plus className="w-4 h-4" /></button>
                </div>
                <span className="font-bold text-primary text-lg">
                  {formatKES((item.price + (item.addons ? item.addons.reduce((sum, a) => sum + (a.price * a.quantity), 0) : 0)) * item.quantity)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-primary">{formatKES(getTotal())}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('savanna:open-cart'))}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 py-4 text-lg font-bold text-neutral-950 shadow-xl transition hover:bg-amber-400 active:scale-[0.99]"
        >
          Continue to checkout
        </button>
      </div>
    </div>
  );
}