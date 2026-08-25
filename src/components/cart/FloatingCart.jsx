import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCart';
import { useCurrency } from '@/context/CurrencyContext';

export default function FloatingCart() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const { format } = useCurrency();
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = getTotal();

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 100, x: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-4 md:left-8 z-50 w-[calc(100%-2rem)] md:w-80"
      >
        <Link to="/cart">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary hover:bg-secondary text-white rounded-2xl shadow-2xl shadow-primary/30 p-4 flex items-center justify-between border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-primary"
                >
                  {totalItems}
                </motion.span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Your Order</span>
                <span className="text-lg font-bold leading-none">{format(totalPrice)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-sm font-bold bg-white/20 px-3 py-1.5 rounded-full">
              View <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}