import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCart';
import { MapPin, Sparkles } from 'lucide-react';

export default function TablePage() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const setTableId = useCartStore(state => state.setTableId);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!tableId) {
      navigate('/menu');
      return;
    }
    setTableId(tableId);
    
    // Choreographed welcome sequence
    const t1 = setTimeout(() => setStep(1), 1500);
    const t2 = setTimeout(() => setStep(2), 3000);
    const t3 = setTimeout(() => navigate('/menu'), 4500);
    
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [tableId, setTableId, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-secondary to-dark">
      <div className="relative z-10 text-center px-6 max-w-lg text-white">
        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" /><span className="text-sm font-semibold">Savanna Grill</span>
            </motion.div>
            <h1 className="text-5xl font-bold mb-3">Karibu!</h1>
            <div className="inline-flex items-center gap-3 bg-white text-secondary px-6 py-4 rounded-2xl shadow-2xl mt-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase font-semibold">Your Table</div>
                <div className="text-3xl font-bold text-primary">#{tableId}</div>
              </div>
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold">Preparing your menu...</h2>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-7xl mb-4 animate-bounce">🍽️</div>
            <h2 className="text-3xl font-bold">Let's order!</h2>
          </motion.div>
        )}
      </div>
    </div>
  );
}
