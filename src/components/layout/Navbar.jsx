import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCart';
import { useCurrency } from '@/context/CurrencyContext';

export default function Navbar() {
  const location = useLocation();
  const totalItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const isHome = location.pathname === '/';
  
  // Currency State
  const { currency, setCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef(null);

  // Theme State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Sync theme with localStorage/system on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies = [
    { code: 'KES', label: 'KES' },
    { code: 'USD', label: 'USD' },
    { code: 'EUR', label: 'EUR' },
    { code: 'BTC', label: 'BTC' },
  ];

  // Dynamic classes that adapt to theme
const glassBg = isHome
    ? 'bg-transparent'
    : `backdrop-blur-xl ${
        isDark 
          ? 'bg-[#121212]/80 border-gray-800/50' 
          : 'bg-white/80 border-gray-200/50'
      }`;

const textClass = isHome 
    ? 'text-dark group-hover:text-primary' 
    : `${
        isDark 
          ? 'text-white group-hover:text-primary' 
          : 'text-gray-900 group-hover:text-primary'
      }`;
    
const iconBtnClass = isHome 
    ? 'text-dark hover:bg-dark/10' 
    : `${
        isDark 
          ? 'text-white hover:bg-white/10' 
          : 'text-gray-900 hover:bg-gray-100'
      }`;
      
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0  left-0 right-0 z-50 transition-all duration-500 ${glassBg} border-b`}
    >
      {/* Glass Reflection Effect */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
        isDark ? 'opacity-10' : 'opacity-5'
      }`}>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white via-transparent to-transparent transform -skew-x-12" />
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-white via-transparent to-transparent transform skew-x-12" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between z-10">
        
        {/* Animated Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <motion.span 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-2xl"
          >
            
          </motion.span>
          <span className={`text-xl md:text-2xl font-extrabold tracking-tight transition-colors duration-300 ${textClass}`}>
            Savanna Grill
          </span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Currency Switcher */}
          <div className="relative" ref={currencyRef}>
            <button 
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                iconBtnClass
              } ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              {currency} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            
            <AnimatePresence>
              {isCurrencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-32 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/95 border-gray-700' 
                      : 'bg-white/95 border-gray-200'
                  } backdrop-blur-xl border rounded-xl shadow-2xl z-50 overflow-hidden`}
                >
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setIsCurrencyOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        currency === c.code 
                          ? 'bg-primary/20 text-primary font-bold' 
                          : isDark 
                            ? 'text-white hover:bg-white/10' 
                            : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative p-2 md:p-2.5 rounded-full transition-all duration-300 ${
              iconBtnClass
            } ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-yellow-400' : 'text-gray-700'}`} />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-yellow-400' : 'text-amber-500'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Cart Button with Animated Badge */}
          <Link to="/cart" className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 md:p-2.5 rounded-full transition-all duration-300 ${
                iconBtnClass
              } ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <ShoppingBag className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
            </motion.div>
            
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className={`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 ${
                    isDark ? 'border-[#121212]' : 'border-white'
                  } shadow-md`}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
        </div>

        {/* ================= ANIMATED WAVES BOTTOM BORDER ================= */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 1440 40" className="w-full h-full" preserveAspectRatio="none">
            {/* Wave 1 - Primary Color - Slowest */}
            <path 
              d="M0,30 C360,10 720,50 1080,20 C1260,10 1380,25 1440,15 L1440,40 L0,40 Z" 
              className={`${isDark ? 'fill-primary' : 'fill-primary'} opacity-40`}
            >
              <animate 
                attributeName="d" 
                dur="6s" 
                repeatCount="indefinite"
                values="
                  M0,30 C360,10 720,50 1080,20 C1260,10 1380,25 1440,15 L1440,40 L0,40 Z;
                  M0,20 C360,40 720,10 1080,30 C1260,40 1380,15 1440,25 L1440,40 L0,40 Z;
                  M0,30 C360,10 720,50 1080,20 C1260,10 1380,25 1440,15 L1440,40 L0,40 Z
                "
              />
            </path>
            
            {/* Wave 2 - Secondary Color - Medium */}
            <path 
              d="M0,25 C360,45 720,15 1080,35 C1260,25 1380,40 1440,20 L1440,40 L0,40 Z" 
              className={`${isDark ? 'fill-secondary' : 'fill-secondary'} opacity-50`}
            >
              <animate 
                attributeName="d" 
                dur="5s" 
                repeatCount="indefinite"
                values="
                  M0,25 C360,45 720,15 1080,35 C1260,25 1380,40 1440,20 L1440,40 L0,40 Z;
                  M0,35 C360,15 720,45 1080,25 C1260,35 1380,20 1440,30 L1440,40 L0,40 Z;
                  M0,25 C360,45 720,15 1080,35 C1260,25 1380,40 1440,20 L1440,40 L0,40 Z
                "
              />
            </path>

            {/* Wave 3 - Amber - Fastest */}
            <path 
              d="M0,35 C360,25 720,45 1080,15 C1260,20 1380,35 1440,25 L1440,40 L0,40 Z" 
              className={`${isDark ? 'fill-amber-500' : 'fill-amber-200'} opacity-50`}
            >
              <animate 
                attributeName="d" 
                dur="4s" 
                repeatCount="indefinite"
                values="
                  M0,35 C360,25 720,45 1080,15 C1260,20 1380,35 1440,25 L1440,40 L0,40 Z;
                  M0,25 C360,35 720,25 1080,35 C1260,15 1380,25 1440,35 L1440,40 L0,40 Z;
                  M0,35 C360,25 720,45 1080,15 C1260,20 1380,35 1440,25 L1440,40 L0,40 Z
                "
              />
            </path>

            {/* Wave 4 - White highlight - Fastest */}
            <path 
              d="M0,38 C360,32 720,38 1080,32 C1260,35 1380,38 1440,33 L1440,40 L0,40 Z" 
              className={`${isDark ? 'fill-white/10' : 'fill-white/30'}`}
            >
              <animate 
                attributeName="d" 
                dur="3s" 
                repeatCount="indefinite"
                values="
                  M0,38 C360,32 720,38 1080,32 C1260,35 1380,38 1440,33 L1440,40 L0,40 Z;
                  M0,33 C360,38 720,32 1080,38 C1260,32 1380,35 1440,38 L1440,40 L0,40 Z;
                  M0,38 C360,32 720,38 1080,32 C1260,35 1380,38 1440,33 L1440,40 L0,40 Z
                "
              />
            </path>
          </svg>
        </div>

      </div>
    </motion.nav>
  );
}