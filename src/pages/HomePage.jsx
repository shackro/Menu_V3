import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Utensils, Sun, Moon, Cake, Martini, Coffee, Flower, BedDouble,
  ConciergeBell, X, MessageCircle, RefreshCw, ShoppingBag,
  ArrowRight, Star, CheckCircle2, Server, Cloud, ShieldCheck,
  Heart, Share2, MessageSquare
} from 'lucide-react';
import { fetchMenuItems, getCmsImageUrl } from '@/api/cms';
import { useCurrency } from '@/context/CurrencyContext';
import { useCartStore } from '@/store/useCart';
import FloatingCart from '@/components/cart/FloatingCart';
import HeroSection from '@/components/sections/HeroSection';

const CATEGORIES = [
  { id: "breakfast", name: "Breakfast", icon: Utensils, sort_order: 1 },
  { id: "lunch", name: "Lunch", icon: Sun, sort_order: 2 },
  { id: "dinner", name: "Dinner", icon: Moon, sort_order: 3 },
  { id: "desserts", name: "Desserts", icon: Cake, sort_order: 4 },
  { id: "bar", name: "Bar & Cocktails", icon: Martini, sort_order: 5 },
  { id: "coffee", name: "Coffee & Drinks", icon: Coffee, sort_order: 6 },
  { id: "spa", name: "Spa & Wellness", icon: Flower, sort_order: 7 },
  { id: "room-service", name: "Room Service", icon: BedDouble, sort_order: 8 },
  { id: "concierge", name: "Concierge & Events", icon: ConciergeBell, sort_order: 9 }
];

const SOCIAL_REVIEWS = [
  {
    id: 1,
    author: "Developer",
    handle: "@techNinja254",
    avatar: "👨‍💻",
    platform: "Twitter",
    text: "Just spent 4 hours working from Savanna Grill ☕ Best secure WiFi in Nairobi and the ugali is perfect for long coding sessions. This is now my official office!",
    likes: 1203,
    replies: 45,
    timestamp: "2h ago",
    rating: 5
  },
  {
    id: 2,
    author: "Business Professional",
    handle: "@EntrepreneurKE",
    avatar: "👨‍💼",
    platform: "LinkedIn",
    text: "Hosted my quarterly team meeting at Savanna Grill. Professional atmosphere, amazing Nyama Choma platter, and their concierge service handled everything perfectly. Highly recommended for business lunches!",
    likes: 856,
    replies: 32,
    timestamp: "1d ago",
    rating: 5
  },
  {
    id: 3,
    author: "Food Blogger",
    handle: "@TasteOfKenya",
    avatar: "👩‍🍳",
    platform: "Instagram",
    text: "The authentic flavors at Savanna Grill are unmatched! Every dish tells a story of Kenyan cuisine perfection. Their Chapati & Sukuma Wiki combo is an absolute must-try. Modern restaurant with traditional soul.",
    likes: 2451,
    replies: 127,
    timestamp: "3d ago",
    rating: 5
  },
  {
    id: 4,
    author: "Student",
    handle: "@UnivLife_Nai",
    avatar: "👩‍🎓",
    platform: "TikTok",
    text: "Found my new study spot! Savanna Grill has affordable menu items, amazing ambiance, and they don't rush you out. Plus the coffee is 🔥 Perfect for exam prep season. 10/10 would recommend to broke students!",
    likes: 3842,
    replies: 289,
    timestamp: "5d ago",
    rating: 5
  },
  {
    id: 5,
    author: "Family Dad",
    handle: "@FamilyFirst_KE",
    avatar: "👨‍👩‍👧‍👦",
    platform: "Facebook",
    text: "Took the whole family to Savanna Grill for Sunday lunch. The kids loved the fresh juice bar, my wife enjoyed the spa services, and I got my perfect Grilled Tilapia. Everyone left happy. Great family-friendly restaurant!",
    likes: 645,
    replies: 78,
    timestamp: "1w ago",
    rating: 5
  }
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("breakfast");
  const [whatsappToast, setWhatsappToast] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedNumber = localStorage.getItem('userWhatsappNumber');
      const dismissed = sessionStorage.getItem('whatsappDismissed');
      return !savedNumber && !dismissed;
    }
    return true;
  });
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappSubmitted, setWhatsappSubmitted] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breakfastPage, setBreakfastPage] = useState(1);
  const [lunchPage, setLunchPage] = useState(1);
  const itemsPerPage = 3;
  const { format } = useCurrency();
  const addItem = useCartStore((state) => state.addItem);

  // Track theme changes
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = document.documentElement;
    const updateTheme = () => setIsDark(el.classList.contains('dark'));
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Handle WhatsApp number submission
  const handleWhatsappSubmit = (e) => {
    e.preventDefault();
    if (whatsappNumber.trim()) {
      // Store in localStorage
      localStorage.setItem('userWhatsappNumber', whatsappNumber);
      setWhatsappSubmitted(true);
      setShowWhatsappModal(false);
      setWhatsappToast(false);
      // Reset after 3 seconds
      setTimeout(() => setWhatsappSubmitted(false), 3000);
    }
  };

  // Load menu data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const items = await fetchMenuItems();
        setMenuItems(items || []);
      } catch (error) {
        console.error("Failed to load menu data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter items by category
  const getCategoryItems = (categoryId) => {
    const categoryNames = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      desserts: "Desserts",
      bar: "Bar & Cocktails",
      coffee: "Coffee & Drinks",
      spa: "Spa & Wellness",
      "room-service": "Room Service",
      concierge: "Concierge & Events"
    };

    return menuItems.filter(item =>
      item.is_available && item.category?.name === categoryNames[categoryId]
    );
  };

  // Get paginated items
  const getPaginatedItems = (categoryId, page) => {
    const items = getCategoryItems(categoryId);
    const startIdx = (page - 1) * itemsPerPage;
    return items.slice(startIdx, startIdx + itemsPerPage);
  };

  // Get total pages
  const getTotalPages = (categoryId) => {
    const items = getCategoryItems(categoryId);
    return Math.ceil(items.length / itemsPerPage);
  };

  // Get best sellers (limit to 3)
  const bestSellers = menuItems
    .filter(i => i.status_badge === 'best_seller' && i.is_available)
    .slice(0, 3);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-500 antialiased overflow-x-hidden transition-colors duration-500 ${
      isDark
        ? 'bg-neutral-950 text-neutral-50 selection:text-black'
        : 'bg-gray-50 text-gray-900 selection:text-white'
    }`}>

      {/* HERO SECTION - Full screen animated hero with threads and chef profile */}
      <HeroSection />

      {/* 1. FLOATING HOUSE IDENTIFIER NOTIFICATION TOAST */}
      <AnimatePresence>
        {whatsappToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-24 right-4 z-50 max-w-xs w-full backdrop-blur-md p-4 rounded-xl shadow-2xl flex flex-col gap-3 border transition-all duration-300 ${
              isDark
                ? 'bg-neutral-900/95 border-neutral-800'
                : 'bg-gray-100/95 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDark ? 'bg-red-500/10' : 'bg-red-500/20'
                }`}>
                  <span className="text-xl">🍽️</span>
                </div>
                <div>
                  <h4 className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? 'text-neutral-500' : 'text-gray-600'
                  }`}>Welcome to:</h4>
                  <p className={`text-sm font-extrabold transition-colors duration-300 ${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  }`}>Savanna Grill</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappToast(false)}
                className={`p-1 transition-colors duration-300 ${
                  isDark
                    ? 'text-neutral-500 hover:text-neutral-300'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowWhatsappModal(true)}
              className={`w-full text-white text-[11px] font-bold py-2.5 px-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                isDark
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 shadow-amber-900/20'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/20'
              }`}>
              <MessageCircle className="w-3.5 h-3.5" /> Add WhatsApp for Updates
            </button>
            <button className={`text-[10px] flex items-center justify-center gap-1 mt-[-4px] transition-colors duration-300 ${
              isDark
                ? 'text-neutral-500 hover:text-neutral-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => {
              setWhatsappToast(false);
              // Optionally store a flag to not show again for this session
              sessionStorage.setItem('whatsappDismissed', 'true');
            }}>
              <RefreshCw className="w-2.5 h-2.5" /> Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WHATSAPP MODAL POPUP */}
      <AnimatePresence>
        {showWhatsappModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWhatsappModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl transition-colors duration-300 ${
                isDark
                  ? 'bg-neutral-900 border border-neutral-800'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Join Our WhatsApp
                </h3>
                <button
                  onClick={() => setShowWhatsappModal(false)}
                  className={`p-1 rounded-lg transition-colors duration-300 ${
                    isDark
                      ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className={`mb-6 transition-colors duration-300 ${
                isDark ? 'text-neutral-400' : 'text-gray-700'
              }`}>
                Get instant updates on special offers, new menu items, and exclusive deals!
              </p>

              <form onSubmit={handleWhatsappSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-neutral-300' : 'text-gray-800'
                  }`}>
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-300 ${
                      isDark
                        ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none'
                        : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none'
                    }`}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWhatsappModal(false)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                      isDark
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                      isDark
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" /> Join Now
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS NOTIFICATION */}
      <AnimatePresence>
        {whatsappSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors duration-300 ${
              isDark
                ? 'bg-green-600 text-white'
                : 'bg-green-500 text-white'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">WhatsApp number saved!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC BROWSE CATEGORIES BLOCK */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-16">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center space-y-2 mb-8"
        >
          <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors duration-300 ${
            isDark ? 'text-amber-500' : 'text-amber-600'
          }`}>Discover the Flow</span>
          <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight transition-colors duration-300 ${
            isDark ? 'text-neutral-200' : 'text-gray-900'
          }`}>Browse Categories</h2>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/5'
                      : 'bg-amber-500/20 border-amber-500/60 text-amber-700 shadow-lg shadow-amber-500/10'
                    : isDark
                      ? 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      : 'bg-gray-100/60 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? 'bg-amber-500 text-black'
                      : 'bg-amber-600 text-white'
                    : isDark
                      ? 'bg-neutral-800 group-hover:bg-neutral-700'
                      : 'bg-gray-300 group-hover:bg-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold tracking-tight truncate w-full text-center">{cat.name}</span>
                <span className={`text-[9px] font-mono mt-0.5 transition-colors duration-300 ${
                  isActive
                    ? isDark
                      ? 'text-amber-500/80'
                      : 'text-amber-600/80'
                    : isDark
                      ? 'text-neutral-600'
                      : 'text-gray-500'
                }`}>
                  12+ items
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* 3. THE WEEKEND DUAL-TIMELINE SKEW CARD SECTION */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center space-y-2 mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter transition-colors duration-300 ${
            isDark ? 'text-neutral-100' : 'text-gray-900'
          }`}>Full Weekend Menu</h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-neutral-500' : 'text-gray-600'
          }`}>Browse our complete culinary timeline by meal hour</p>
        </motion.div>

        {/* The Weekend Menu Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm overflow-hidden border transition-all duration-300 ${
            isDark
              ? 'bg-neutral-900/30 border-amber-500/20'
              : 'bg-gray-50/80 border-amber-500/30'
          }`}
        >
          {/* Subtle background glow */}
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-300 ${
            isDark ? 'bg-amber-500/5' : 'bg-amber-500/10'
          }`} />

          {/* Header */}
          <div className={`flex flex-col md:flex-row items-center justify-between border-b pb-8 mb-10 gap-6 relative z-10 transition-colors duration-300 ${
            isDark ? 'border-neutral-800/80' : 'border-gray-300/60'
          }`}>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Utensils className={`w-4 h-4 transition-colors duration-300 ${
                  isDark ? 'text-amber-500' : 'text-amber-600'
                }`} />
                <span className={`text-sm font-serif italic tracking-wide transition-colors duration-300 ${
                  isDark ? 'text-amber-500' : 'text-amber-600'
                }`}>Savanna Grill</span>
              </div>
              <h3 className={`text-4xl md:text-5xl font-serif tracking-tight transition-colors duration-300 ${
                isDark ? 'text-neutral-100' : 'text-gray-900'
              }`}>
                Weekend <span className={`font-sans font-black block text-5xl md:text-6xl uppercase mt-1 transition-colors duration-300 ${
                  isDark ? 'text-neutral-300' : 'text-gray-800'
                }`}>Menu</span>
              </h3>
              <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                <div className={`h-px w-12 transition-colors duration-300 ${
                  isDark ? 'bg-amber-500/50' : 'bg-amber-600/50'
                }`} />
                <div className="flex gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    isDark ? 'bg-amber-500' : 'bg-amber-600'
                  }`} />
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    isDark ? 'bg-amber-500/50' : 'bg-amber-600/50'
                  }`} />
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    isDark ? 'bg-amber-500/20' : 'bg-amber-600/20'
                  }`} />
                </div>
                <div className={`h-px w-12 transition-colors duration-300 ${
                  isDark ? 'bg-amber-500/50' : 'bg-amber-600/50'
                }`} />
              </div>
            </div>

            {/* Feature Image */}
            <div className="relative w-48 h-32 rounded-xl overflow-hidden border shadow-xl rotate-2 group transition-all duration-300" style={{
              borderColor: isDark ? 'rgb(38 38 38)' : 'rgb(209 213 219)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80"
                alt="Signature Dish"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-3 text-[10px] font-black text-amber-400 uppercase tracking-widest">Chef's Feature</span>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {/* Breakfast */}
            <div className="space-y-6">
              <div className={`flex items-center gap-3 border-b pb-3 transition-colors duration-300 ${
                isDark ? 'border-neutral-800' : 'border-gray-300'
              }`}>
                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDark ? 'bg-amber-500/10' : 'bg-amber-500/20'
                }`}>
                  <Utensils className={`w-5 h-5 transition-colors duration-300 ${
                    isDark ? 'text-amber-500' : 'text-amber-600'
                  }`} />
                </div>
                <h4 className={`text-xl font-serif tracking-wide transition-colors duration-300 ${
                  isDark ? 'text-neutral-200' : 'text-gray-900'
                }`}>Breakfast</h4>
              </div>
              <div className="space-y-5">
                {loading ? (
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-neutral-500' : 'text-gray-600'
                  }`}>Loading breakfast items...</p>
                ) : getPaginatedItems("breakfast", breakfastPage).length > 0 ? (
                  getPaginatedItems("breakfast", breakfastPage).map((item) => (
                    <MenuItemRow key={item.documentId} item={item} format={format} addItem={addItem} isDark={isDark} />
                  ))
                ) : (
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-neutral-500' : 'text-gray-600'
                  }`}>No breakfast items available</p>
                )}
              </div>
              {/* Breakfast Pagination */}
              {getTotalPages("breakfast") > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t" style={{
                  borderColor: isDark ? 'rgb(38 38 38)' : 'rgb(209 213 219)'
                }}>
                  <button
                    onClick={() => setBreakfastPage(p => Math.max(1, p - 1))}
                    disabled={breakfastPage === 1}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
                      breakfastPage === 1
                        ? isDark
                          ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isDark
                          ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                          : 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30'
                    }`}
                  >
                    ← Prev
                  </button>
                  <span className={`px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
                    isDark ? 'text-neutral-400' : 'text-gray-700'
                  }`}>
                    {breakfastPage} / {getTotalPages("breakfast")}
                  </span>
                  <button
                    onClick={() => setBreakfastPage(p => Math.min(getTotalPages("breakfast"), p + 1))}
                    disabled={breakfastPage === getTotalPages("breakfast")}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
                      breakfastPage === getTotalPages("breakfast")
                        ? isDark
                          ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isDark
                          ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                          : 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* Lunch */}
            <div className="space-y-6">
              <div className={`flex items-center gap-3 border-b pb-3 transition-colors duration-300 ${
                isDark ? 'border-neutral-800' : 'border-gray-300'
              }`}>
                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDark ? 'bg-amber-500/10' : 'bg-amber-500/20'
                }`}>
                  <Sun className={`w-5 h-5 transition-colors duration-300 ${
                    isDark ? 'text-amber-500' : 'text-amber-600'
                  }`} />
                </div>
                <h4 className={`text-xl font-serif tracking-wide transition-colors duration-300 ${
                  isDark ? 'text-neutral-200' : 'text-gray-900'
                }`}>Lunch</h4>
              </div>
              <div className="space-y-5">
                {loading ? (
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-neutral-500' : 'text-gray-600'
                  }`}>Loading lunch items...</p>
                ) : getPaginatedItems("lunch", lunchPage).length > 0 ? (
                  getPaginatedItems("lunch", lunchPage).map((item) => (
                    <MenuItemRow key={item.documentId} item={item} format={format} addItem={addItem} isDark={isDark} />
                  ))
                ) : (
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-neutral-500' : 'text-gray-600'
                  }`}>No lunch items available</p>
                )}
              </div>
              {/* Lunch Pagination */}
              {getTotalPages("lunch") > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t" style={{
                  borderColor: isDark ? 'rgb(38 38 38)' : 'rgb(209 213 219)'
                }}>
                  <button
                    onClick={() => setLunchPage(p => Math.max(1, p - 1))}
                    disabled={lunchPage === 1}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
                      lunchPage === 1
                        ? isDark
                          ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isDark
                          ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                          : 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30'
                    }`}
                  >
                    ← Prev
                  </button>
                  <span className={`px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
                    isDark ? 'text-neutral-400' : 'text-gray-700'
                  }`}>
                    {lunchPage} / {getTotalPages("lunch")}
                  </span>
                  <button
                    onClick={() => setLunchPage(p => Math.min(getTotalPages("lunch"), p + 1))}
                    disabled={lunchPage === getTotalPages("lunch")}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
                      lunchPage === getTotalPages("lunch")
                        ? isDark
                          ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isDark
                          ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                          : 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. HIGH-CONVERSION BEST SELLERS COMPONENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-t border-neutral-900">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <span className="text-[11px] font-black tracking-[0.2em] text-red-500 uppercase flex items-center gap-2">
              <Star className="w-3 h-3 fill-current" /> Customer Favorites
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-neutral-100 mt-2">Best Sellers</h2>
          </div>
          <Link to="/menu" className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-neutral-500">Loading best sellers...</p>
          ) : bestSellers.length > 0 ? (
            bestSellers.map((item, i) => (
              <motion.div
                key={item.documentId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getCmsImageUrl(item.images || item.image, 'medium')}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'; }}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {item.category?.name || 'Featured'}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                    <span className="text-lg font-black text-amber-500">{format(item.price)}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Customer Favorite
                  </p>
                  <button
                    onClick={() => {
                      addItem({
                        dishId: item.documentId || item.id,
                        name: item.name,
                        price: item.price,
                        image: getCmsImageUrl(item.images || item.image, 'thumbnail'),
                        quantity: 1,
                        spiceLevel: item.spice_level ? item.spice_level.charAt(0).toUpperCase() + item.spice_level.slice(1) : 'Mild',
                        specialInstructions: '',
                      });
                    }}
                    className="w-full bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-300 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Order
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-neutral-500">No best sellers available</p>
          )}
        </div>
      </section>

      {/* 6. SOCIAL MEDIA REVIEWS & TOP POSTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-t" style={{
        borderColor: isDark ? 'rgb(23 23 23)' : 'rgb(229 231 235)'
      }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center space-y-3 mb-16"
        >
          <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors duration-300 flex items-center justify-center gap-2 ${
            isDark ? 'text-blue-500' : 'text-blue-600'
          }`}>
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDark ? 'bg-blue-500' : 'bg-blue-600'
            }`} />
            What People Are Saying
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDark ? 'bg-blue-500' : 'bg-blue-600'
            }`} />
          </span>
          <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter transition-colors duration-300 ${
            isDark ? 'text-neutral-100' : 'text-gray-900'
          }`}>Top Social Reviews</h2>
          <p className={`text-base transition-colors duration-300 ${
            isDark ? 'text-neutral-500' : 'text-gray-600'
          }`}>Real experiences from our community across social platforms</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {SOCIAL_REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group relative rounded-2xl p-6 transition-all duration-300 border backdrop-blur-sm overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-br from-neutral-900/60 via-neutral-900/40 to-blue-900/20 border-blue-500/20 hover:border-blue-500/50 shadow-lg shadow-blue-900/10'
                  : 'bg-gradient-to-br from-white/60 via-white/40 to-blue-100/20 border-blue-200/40 hover:border-blue-400/60 shadow-lg shadow-blue-200/20'
              }`}
            >
              {/* Animated background glow */}
              <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                isDark
                  ? 'bg-gradient-to-r from-blue-600/10 via-transparent to-blue-600/10'
                  : 'bg-gradient-to-r from-blue-400/10 via-transparent to-blue-400/10'
              }`} />

              <div className="relative z-10">
                {/* Header with Avatar & Platform */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl p-2 rounded-xl transition-transform duration-300 group-hover:scale-110" style={{
                      background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)'
                    }}>
                      {review.avatar}
                    </div>
                    <div>
                      <p className={`text-xs font-black uppercase tracking-wider transition-colors duration-300 ${
                        isDark ? 'text-neutral-300' : 'text-gray-800'
                      }`}>{review.author}</p>
                      <p className={`text-[10px] transition-colors duration-300 ${
                        isDark ? 'text-neutral-500' : 'text-gray-600'
                      }`}>{review.handle}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-300 ${
                    isDark
                      ? 'bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25'
                      : 'bg-blue-500/20 text-blue-600 group-hover:bg-blue-500/35'
                  }`}>
                    {review.platform}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.2 }}>
                      <Star className={`w-4 h-4 fill-yellow-400 transition-colors duration-300 ${
                        isDark ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                    </motion.div>
                  ))}
                </div>

                {/* Review Text */}
                <p className={`text-[13px] leading-relaxed mb-5 font-medium transition-colors duration-300 ${
                  isDark ? 'text-neutral-300' : 'text-gray-800'
                }`}>
                  "{review.text}"
                </p>

                {/* Engagement Metrics */}
                <div className={`flex items-center gap-5 pb-5 border-b transition-colors duration-300 ${
                  isDark ? 'border-neutral-700/50' : 'border-gray-300/50'
                }`}>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Heart className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                      isDark ? 'text-red-500/70' : 'text-red-500/70'
                    }`} />
                    <span className={`font-bold transition-colors duration-300 ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>{(review.likes / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <MessageSquare className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                      isDark ? 'text-blue-500/70' : 'text-blue-500/70'
                    }`} />
                    <span className={`font-bold transition-colors duration-300 ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>{review.replies}</span>
                  </div>
                </div>

                {/* Timestamp */}
                <p className={`text-[10px] mt-4 transition-colors duration-300 ${
                  isDark ? 'text-neutral-600' : 'text-gray-500'
                }`}>
                  Posted {review.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`px-10 py-4 rounded-2xl font-bold text-base flex items-center gap-3 transition-all duration-300 shadow-xl ${
              isDark
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-900/40'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-blue-400/40'
            }`}
          >
            <Share2 className="w-5 h-5" />
            <span>Follow Our Social Media</span>
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </section>

      {/* 5. SYSTEMS AUTOMATION DETAILED FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8 px-4 md:px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Core Logistics Meta */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-amber-500 italic">Savanna Grill</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Authentic Kenyan cuisine crafted with passion. Scan, browse, and order seamlessly straight to your table with our digital menu system.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-mono bg-emerald-500/5 px-2 py-1 rounded w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Sync Active
            </div>
          </div>

          {/* Column 2: Operation Hubs */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider">Integrated Hubs</h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Main Dining Room Terminal</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Food Court Express Hub</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Cloud Delivery Kitchen</li>
            </ul>
          </div>

          {/* Column 3: Tech Architecture Stack Indicators */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider">Core Integrations</h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li className="flex items-center gap-2"><Server className="w-3 h-3" /> Lipana / Daraja M-Pesa API</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-3 h-3" /> WhatsApp Web Interface Hook</li>
              <li className="flex items-center gap-2"><Cloud className="w-3 h-3" /> Supabase Realtime Storage</li>
            </ul>
          </div>

          {/* Column 4: Local Sourcing & Access Credentials */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sourcing Standard
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              All poultry and beef structures are 100% Halal certified and sourced daily from verified local providers in Nairobi County.
            </p>
          </div>
        </div>

        {/* Closing Platform Runtime Anchor */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-600">
            © {new Date().getFullYear()} Savanna Grill Operations. All rights reserved.
          </p>
          <p className="text-[10px] font-mono text-neutral-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            pipeline-status: secure // env: production-v2.4
          </p>
        </div>
      </footer>

      <FloatingCart />
    </div>
  );
}

// --- REUSABLE MENU ITEM ROW COMPONENT ---
function MenuItemRow({ item, format, addItem, isDark }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={`group flex items-start gap-4 p-3 rounded-xl transition-all duration-300 ${
        isDark
          ? 'hover:bg-neutral-800/30'
          : 'hover:bg-gray-200/50'
      }`}
    >
      <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border transition-colors duration-300 ${
        isDark ? 'border-neutral-800' : 'border-gray-300'
      }`}>
        <img
          src={getCmsImageUrl(item.images || item.image, 'thumbnail')}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80'; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h5 className={`text-sm font-bold truncate transition-colors duration-300 ${
            isDark
              ? 'text-neutral-200 group-hover:text-amber-400'
              : 'text-gray-900 group-hover:text-amber-600'
          }`}>
            {item.name}
          </h5>
          <span className={`text-sm font-black whitespace-nowrap transition-colors duration-300 ${
            isDark ? 'text-amber-500' : 'text-amber-600'
          }`}>
            {format(item.price)}
          </span>
        </div>
        <p className={`text-[11px] leading-relaxed line-clamp-2 mb-2 transition-colors duration-300 ${
          isDark ? 'text-neutral-500' : 'text-gray-700'
        }`}>
          {item.description}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addItem({
                dishId: item.documentId || item.id,
                name: item.name,
                price: item.price,
                image: getCmsImageUrl(item.images || item.image, 'thumbnail'),
                quantity: 1,
                spiceLevel: item.spice_level ? item.spice_level.charAt(0).toUpperCase() + item.spice_level.slice(1) : 'Mild',
                specialInstructions: '',
              });
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? 'bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-400'
                : 'bg-gray-300 hover:bg-amber-600 hover:text-white text-gray-700'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
          </button>
          <Link
            to={`/dish/${item.documentId || item.id}`}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
          >
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
