import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/useUser';
import { Phone, Check, X, Trophy, Sparkles } from 'lucide-react';

const PERSONAS = [
  { name: "Professional Fry Eater", icon: "🍟", anim: "bounce" },
  { name: "Senior Burger Inspector", icon: "🍔", anim: "pulse" },
  { name: "Midnight Nyama Choma", icon: "🥩", anim: "pulse" },
  { name: "Lord of the Wings", icon: "🍗", anim: "wiggle" },
  { name: "Caffeine Overlord", icon: "☕", anim: "pulse" },
];

export default function FoodAvatarWidget() {
  const [identity, setIdentity] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const { phoneNumber, setPhoneNumber, loyaltyStamps } = useUserStore();

  useEffect(() => {
    const saved = localStorage.getItem('cafe_guest_persona');
    if (saved) setIdentity(JSON.parse(saved));
    else {
      const newId = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
      localStorage.setItem('cafe_guest_persona', JSON.stringify(newId));
      setIdentity(newId);
    }
  }, []);

  const handleSavePhone = () => {
    let formatted = phoneInput.trim().replace(/\s+/g, '');
    if (formatted.startsWith('0')) formatted = '254' + formatted.substring(1);
    else if (!formatted.startsWith('254')) formatted = '254' + formatted;
    if (formatted.length === 12 && /^\d+$/.test(formatted)) {
      setPhoneNumber(formatted);
      setIsEditingPhone(false);
      setPhoneInput('');
    }
  };

  if (!identity) return null;
  const getAnim = () => identity.anim === 'bounce' ? { y: [0, -6, 0] } : identity.anim === 'wiggle' ? { rotate: [-8, 8, -8, 8, 0] } : { scale: [1, 1.15, 1] };

  return (
    <div className="fixed top-20 right-4 z-40 hidden md:block"> {/* Hidden on very small mobile to save space, or remove 'hidden md:block' to keep it */}
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setIsMinimized(false)} className="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-full shadow-2xl pl-2 pr-4 py-2 hover:scale-105 transition-transform">
            <motion.div animate={getAnim()} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">{identity.icon}</motion.div>
            <span className="text-xs font-bold text-gray-900 dark:text-white max-w-[120px] truncate">{identity.name.split(' ').slice(0, 2).join(' ')}</span>
            {loyaltyStamps > 0 && <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{loyaltyStamps}🏆</span>}
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 w-[280px] backdrop-blur-xl bg-white/95 dark:bg-dark-card/95">
            <div className="flex items-center gap-3">
              <motion.div animate={getAnim()} transition={{ duration: 2, repeat: Infinity }} className="text-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-2.5 rounded-full shrink-0">{identity.icon}</motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" /> Karibu, you are:</p>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight truncate">"{identity.name}"</p>
              </div>
              <button onClick={() => setIsMinimized(true)} className="text-gray-400 hover:text-primary p-1"><X className="w-4 h-4" /></button>
            </div>
            {loyaltyStamps > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-primary">Loyalty Stamps</span><span className="text-primary">{loyaltyStamps}/10</span></div>
                  <div className="h-1.5 bg-white/50 dark:bg-dark rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${(loyaltyStamps / 10) * 100}%` }} className="h-full bg-primary rounded-full" /></div>
                </div>
              </div>
            )}
            {!phoneNumber && !isEditingPhone ? (
              <button onClick={() => setIsEditingPhone(true)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold py-2.5 rounded-xl">
                <Phone className="w-3 h-3" /> Add WhatsApp for Stamps & M-Pesa
              </button>
            ) : !phoneNumber && isEditingPhone ? (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-2 border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 font-bold mr-1">+254</span>
                  <input type="tel" placeholder="712345678" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSavePhone()} className="w-full bg-transparent text-sm py-2 outline-none" maxLength={9} autoFocus />
                </div>
                <button onClick={handleSavePhone} className="bg-primary text-white p-2 rounded-xl"><Check className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2">
                <span className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> +{phoneNumber}</span>
                <button onClick={() => { setPhoneNumber(''); setPhoneInput(''); }} className="text-[10px] text-red-500 hover:underline font-bold">Change</button>
              </div>
            )}
            <button onClick={() => { const n = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]; localStorage.setItem('cafe_guest_persona', JSON.stringify(n)); setIdentity(n); }} className="text-[11px] text-gray-400 hover:text-primary transition-colors font-medium flex items-center justify-center gap-1">🔄 Get a new funny name</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
