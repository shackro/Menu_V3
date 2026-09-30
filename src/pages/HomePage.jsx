import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Utensils, Sun, Moon, Cake, Martini, Coffee, Flower, BedDouble,
  ConciergeBell, X, MessageCircle, RefreshCw, ShoppingBag,
  ArrowRight, Star, CheckCircle2, Server, Cloud, ShieldCheck,
  Share2, Quote, Camera, Send, Instagram, Twitter, ExternalLink
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

const COMMUNITY_PREVIEW_REVIEWS = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    comment: 'The Choma Feast Board is absolutely unreal! Chef Marcus really outdid himself. The ambiance is perfect for a Friday night.',
    dish: 'Choma Feast Board',
    socials: { instagram: 'sarah.eats.nbi', twitter: null }
  },
  {
    id: 2,
    name: 'James K.',
    rating: 5,
    comment: 'Best Nyama in Nairobi, hands down. The service was incredibly fast and the M-Pesa integration was seamless.',
    dish: 'Nyama Platter',
    socials: { instagram: null, twitter: 'jamesk_foodie' }
  },
  {
    id: 3,
    name: 'Amina H.',
    rating: 4,
    comment: 'Loved the Belgian Waffles! A bit busy on Sunday morning but totally worth the wait. Will definitely be back.',
    dish: 'Belgian Waffles',
    socials: { instagram: 'amina.h', twitter: 'amina_h' }
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappSubmitted, setWhatsappSubmitted] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverReviewRating, setHoverReviewRating] = useState(0);
  const [reviewInstagram, setReviewInstagram] = useState('');
  const [reviewTwitter, setReviewTwitter] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [storyHandle, setStoryHandle] = useState('');
  const [storyTwitter, setStoryTwitter] = useState('');
  const [storyName, setStoryName] = useState('');
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
    <div className={`min-h-screen font-sans selection:bg-amber-500 antialiased overflow-x-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-neutral-950 text-neutral-50 selection:text-white'
        : 'bg-stone-50 text-stone-900 selection:text-white'
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
                : 'bg-white border-stone-200 shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDark ? 'bg-red-500/10' : 'bg-red-50'
                }`}>
                  <span className="text-xl">🍽️</span>
                </div>
                <div>
                  <h4 className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? 'text-neutral-500' : 'text-stone-500'
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
                    : 'text-stone-400 hover:text-stone-600'
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
                : 'text-stone-500 hover:text-stone-700'
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
            isDark ? 'text-neutral-200' : 'text-stone-900'
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
                      : 'bg-amber-50 border-amber-500/50 text-amber-700 shadow-md shadow-amber-500/10'
                    : isDark
                      ? 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? 'bg-amber-500 text-black'
                      : 'bg-amber-500 text-white'
                    : isDark
                      ? 'bg-neutral-800 group-hover:bg-neutral-700'
                      : 'bg-stone-100 group-hover:bg-stone-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold tracking-tight truncate w-full text-center">{cat.name}</span>
                <span className={`text-[9px] font-mono mt-0.5 transition-colors duration-300 ${
                  isActive
                    ? isDark
                      ? 'text-amber-500/80'
                      : 'text-amber-600'
                    : isDark
                      ? 'text-neutral-600'
                      : 'text-stone-400'
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

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 border-t text-center" style={{
        borderColor: isDark ? 'rgb(23 23 23)' : 'rgb(229 231 235)'
      }}>
        <p className={`mb-4 text-sm ${isDark ? 'text-neutral-400' : 'text-stone-600'}`}>
          Guest reviews and stories from the Savanna Grill community.
        </p>
        <Link
          to="/brand?tab=posts"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber-600"
        >
          <MessageCircle className="h-4 w-4" /> Our Stories <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section id="our-stories" className="hidden" style={{
        borderColor: isDark ? 'rgb(23 23 23)' : 'rgb(229 231 235)'
      }}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className={`text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-2 ${
              isDark ? 'text-amber-500' : 'text-amber-600'
            }`}>
              <MessageCircle className="w-3 h-3 fill-current" /> Our Stories
            </span>
            <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter mt-2 ${
              isDark ? 'text-neutral-100' : 'text-stone-900'
            }`}>
              Community Voices & Top Reviews
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowStoryModal(true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                isDark
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              <Camera className="w-4 h-4" /> Share Story
            </button>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-current" /> Leave a Review
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {COMMUNITY_PREVIEW_REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative min-w-0 rounded-2xl p-5 md:p-6 hover:border-amber-500/30 transition-all group border flex flex-col ${
                isDark
                  ? 'bg-neutral-900/50 border-neutral-800'
                  : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <Quote className={`absolute top-4 right-4 w-8 h-8 transition-colors ${
                isDark ? 'text-amber-500/10 group-hover:text-amber-500/20' : 'text-amber-500/15 group-hover:text-amber-500/25'
              }`} />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${idx < review.rating ? 'text-amber-500 fill-current' : isDark ? 'text-neutral-700' : 'text-stone-300'}`}
                  />
                ))}
              </div>

              <p className={`text-sm leading-relaxed mb-6 italic flex-grow break-words ${
                isDark ? 'text-neutral-400' : 'text-stone-600'
              }`}>
                "{review.comment}"
              </p>

              <div className={`pt-4 border-t ${
                isDark ? 'border-neutral-800' : 'border-stone-100'
              }`}>
                <div className="mb-3">
                  <p className={`text-sm font-bold break-words ${isDark ? 'text-neutral-100' : 'text-stone-900'}`}>{review.name}</p>
                  <p className={`text-[10px] uppercase tracking-wider break-words ${isDark ? 'text-neutral-500' : 'text-stone-500'}`}>
                    Ordered: {review.dish}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SocialBadge platform="instagram" handle={review.socials.instagram} isDark={isDark} />
                  <SocialBadge platform="twitter" handle={review.socials.twitter} isDark={isDark} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${
              isDark ? 'text-neutral-100' : 'text-stone-900'
            }`}>Top Social Reviews</h3>
            <p className={`mt-2 text-sm ${isDark ? 'text-neutral-500' : 'text-stone-600'}`}>
              Real experiences shared by our community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {SOCIAL_REVIEWS.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`min-w-0 rounded-2xl border p-5 md:p-6 ${
                  isDark
                    ? 'bg-neutral-900/50 border-neutral-800'
                    : 'bg-white border-stone-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl shrink-0" aria-hidden="true">{review.avatar}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold break-words ${isDark ? 'text-neutral-200' : 'text-stone-800'}`}>
                        {review.author}
                      </p>
                      <p className={`text-[10px] break-all ${isDark ? 'text-neutral-500' : 'text-stone-500'}`}>
                        {review.handle}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase ${
                    isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {review.platform}
                  </span>
                </div>

                <div className="flex gap-1 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className={`text-sm leading-relaxed break-words ${isDark ? 'text-neutral-300' : 'text-stone-700'}`}>
                  “{review.text}”
                </p>
                <p className={`mt-4 text-[10px] ${isDark ? 'text-neutral-500' : 'text-stone-500'}`}>
                  Posted {review.timestamp}
                </p>
              </motion.article>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <a
              href="#"
              className={`px-6 py-3 rounded-xl font-bold text-sm flex flex-wrap justify-center items-center gap-2 text-center transition-all ${
                isDark
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Follow Our Social Media</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <AnimatePresence>
          {showReviewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowReviewModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
                  isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-black ${isDark ? 'text-neutral-100' : 'text-stone-900'}`}>Rate Your Experience</h3>
                  <button onClick={() => setShowReviewModal(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-stone-100'}`}>
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverReviewRating(star)}
                          onMouseLeave={() => setHoverReviewRating(0)}
                        >
                          <Star className={`w-8 h-8 transition-all ${
                            star <= (hoverReviewRating || reviewRating)
                              ? 'text-amber-500 fill-current scale-110'
                              : isDark ? 'text-neutral-700' : 'text-stone-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>Your Name</label>
                    <input className={`w-full px-4 py-3 rounded-xl border focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-500'}`} placeholder="Jane W." />
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>Dish You Ordered</label>
                    <input className={`w-full px-4 py-3 rounded-xl border focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-500'}`} placeholder="Nyama Platter" />
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>Review</label>
                    <textarea rows="4" className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-500'}`} placeholder="Tell us about your experience..." />
                  </div>

                  <div className={`pt-2 border-t ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-3 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
                      Connect your socials (optional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          value={reviewInstagram}
                          onChange={(e) => setReviewInstagram(e.target.value)}
                          aria-label="Instagram handle"
                          className={`w-full px-4 py-3 pl-10 rounded-xl border focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-pink-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-pink-500'}`}
                          placeholder="Instagram handle"
                        />
                      </div>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          value={reviewTwitter}
                          onChange={(e) => setReviewTwitter(e.target.value)}
                          aria-label="X or Twitter handle"
                          className={`w-full px-4 py-3 pl-10 rounded-xl border focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-sky-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-sky-500'}`}
                          placeholder="X / Twitter handle"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Review
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowStoryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
                  isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-stone-200'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-black ${isDark ? 'text-neutral-100' : 'text-stone-900'}`}>Share Your Story</h3>
                  <button onClick={() => setShowStoryModal(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-stone-100'}`}>
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>Your Name</label>
                    <input value={storyName} onChange={(e) => setStoryName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-500'}`} placeholder="Your name" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>Instagram Handle</label>
                      <input value={storyHandle} onChange={(e) => setStoryHandle(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-500'}`} placeholder="@yourhandle" />
                    </div>
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>X / Twitter Handle</label>
                      <input value={storyTwitter} onChange={(e) => setStoryTwitter(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-sky-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-sky-500'}`} placeholder="@yourhandle" />
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>Story Caption</label>
                    <textarea value={storyCaption} onChange={(e) => setStoryCaption(e.target.value)} rows="4" className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none ${isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-500'}`} placeholder="Share the moment that made your visit memorable..." />
                  </div>

                  <div className={`rounded-xl border border-dashed p-4 flex items-center justify-center gap-2 ${isDark ? 'border-neutral-700 bg-neutral-800/60 text-neutral-300' : 'border-stone-300 bg-stone-50 text-stone-600'}`}>
                    <Camera className="w-4 h-4" /> Add a photo moment
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowStoryModal(false)}
                    className="w-full bg-stone-900 hover:bg-stone-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Story
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* 5. SYSTEMS AUTOMATION DETAILED FOOTER */}
      <footer className={`border-t pt-16 pb-8 px-4 md:px-6 mt-20 transition-colors duration-300 ${
        isDark
          ? 'bg-neutral-950 border-neutral-900'
          : 'bg-stone-100 border-stone-200'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Core Logistics Meta */}
          <div className="space-y-4">
            <h3 className={`text-lg font-serif italic ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>Savanna Grill</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-500' : 'text-stone-600'}`}>
              Authentic Kenyan cuisine crafted with passion. Scan, browse, and order seamlessly straight to your table with our digital menu system.
            </p>
            <div className={`flex items-center gap-2 text-[10px] font-mono px-2 py-1 rounded w-fit ${
              isDark
                ? 'text-emerald-500 bg-emerald-500/5'
                : 'text-emerald-600 bg-emerald-500/10'
            }`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Sync Active
            </div>
          </div>

          {/* Column 2: Operation Hubs */}
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-neutral-300' : 'text-stone-800'}`}>Integrated Hubs</h4>
            <ul className={`space-y-2 text-xs ${isDark ? 'text-neutral-500' : 'text-stone-600'}`}>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Main Dining Room Terminal</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Food Court Express Hub</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Cloud Delivery Kitchen</li>
            </ul>
          </div>

          {/* Column 3: Tech Architecture Stack Indicators */}
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-neutral-300' : 'text-stone-800'}`}>Core Integrations</h4>
            <ul className={`space-y-2 text-xs ${isDark ? 'text-neutral-500' : 'text-stone-600'}`}>
              <li className="flex items-center gap-2"><Server className="w-3 h-3" /> Lipana / Daraja M-Pesa API</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-3 h-3" /> WhatsApp Web Interface Hook</li>
              <li className="flex items-center gap-2"><Cloud className="w-3 h-3" /> Supabase Realtime Storage</li>
            </ul>
          </div>

          {/* Column 4: Local Sourcing & Access Credentials */}
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-neutral-300' : 'text-stone-800'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sourcing Standard
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-500' : 'text-stone-600'}`}>
              All poultry and beef structures are 100% Halal certified and sourced daily from verified local providers in Nairobi County.
            </p>
          </div>
        </div>

        {/* Closing Platform Runtime Anchor */}
        <div className={`max-w-7xl mx-auto pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDark ? 'border-neutral-900 text-neutral-600' : 'border-stone-300 text-stone-600'
        }`}>
          <p className="text-[11px]">
            © {new Date().getFullYear()} Savanna Grill Operations. All rights reserved.
          </p>
          <div className={`text-[10px] font-mono flex items-center gap-2 ${isDark ? 'text-neutral-700' : 'text-stone-500'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            <span>pipeline-status: secure // env: production-v2.4</span>
          </div>
        </div>
      </footer>

      <FloatingCart />
    </div>
  );
}

function SocialBadge({ platform, handle, isDark }) {
  if (!handle) return null;

  const cleanHandle = handle.trim().replace(/^@+/, '');
  const isInstagram = platform === 'instagram';
  const isValidHandle = isInstagram
    ? /^[a-zA-Z0-9._]{1,30}$/.test(cleanHandle)
    : /^[a-zA-Z0-9_]{1,15}$/.test(cleanHandle);
  if (!isValidHandle) return null;

  const Icon = isInstagram ? Instagram : Twitter;
  const profileUrl = isInstagram
    ? `https://instagram.com/${cleanHandle}`
    : `https://x.com/${cleanHandle}`;

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${isInstagram ? 'Instagram' : 'X'} profile for @${cleanHandle}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-transform hover:scale-105 ${
        isInstagram
          ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white'
          : isDark
            ? 'bg-white text-neutral-900'
            : 'bg-neutral-900 text-white'
      }`}
    >
      <Icon className="w-3 h-3" />
      <span>@{cleanHandle}</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
    </a>
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
