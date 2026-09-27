import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Utensils, Sun, Moon, Cake, Martini, Coffee, Flower, BedDouble,
  ConciergeBell, X, MessageCircle, RefreshCw, ShoppingBag,
  ArrowRight, Star, CheckCircle2, Server, Cloud, ShieldCheck
} from 'lucide-react';
import { fetchMenuItems, getCmsImageUrl } from '@/api/cms';
import { useCurrency } from '@/context/CurrencyContext';
import { useCartStore } from '@/store/useCart';
import FloatingCart from '@/components/cart/FloatingCart';

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

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("breakfast");
  const [whatsappToast, setWhatsappToast] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { format } = useCurrency();
  const addItem = useCartStore((state) => state.addItem);

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
    ).slice(0, 3);
  };

  // Get best sellers (limit to 3)
  const bestSellers = menuItems
    .filter(i => i.status_badge === 'best_seller' && i.is_available)
    .slice(0, 3);

  // Get breakfast and lunch for weekend menu
  const breakfastItems = getCategoryItems("breakfast");
  const lunchItems = getCategoryItems("lunch");

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-amber-500 selection:text-black antialiased overflow-x-hidden">

      {/* 1. FLOATING HOUSE IDENTIFIER NOTIFICATION TOAST */}
      <AnimatePresence>
        {whatsappToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 right-4 z-50 max-w-xs w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 p-4 rounded-xl shadow-2xl flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <span className="text-xl">🍽️</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">Welcome to:</h4>
                  <p className="text-sm font-extrabold text-amber-400 truncate">Savanna Grill</p>
                </div>
              </div>
              <button onClick={() => setWhatsappToast(false)} className="text-neutral-500 hover:text-neutral-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <button className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-[11px] font-bold py-2.5 px-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20">
              <MessageCircle className="w-3.5 h-3.5" /> Add WhatsApp for Updates
            </button>
            <button className="text-[10px] text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1 mt-[-4px]">
              <RefreshCw className="w-2.5 h-2.5" /> Reload Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC BROWSE CATEGORIES BLOCK */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-16">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center space-y-2 mb-8"
        >
          <span className="text-[11px] font-black tracking-[0.2em] text-amber-500 uppercase">Discover the Flow</span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-neutral-200">Browse Categories</h2>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const itemCount = getCategoryItems(cat.id).length;

            return (
              <motion.button
                key={cat.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/5'
                    : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isActive ? 'bg-amber-500 text-black' : 'bg-neutral-800 group-hover:bg-neutral-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold tracking-tight truncate w-full text-center">{cat.name}</span>
                <span className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-amber-500/80' : 'text-neutral-600'}`}>
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
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-neutral-100">Full Weekend Menu</h2>
          <p className="text-sm text-neutral-500">Browse our complete culinary timeline by meal hour</p>
        </motion.div>

        {/* The Centralized Framed Gold Menu Sheet Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-neutral-900/30 border border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Header Internal Branding */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-neutral-800/80 pb-8 mb-10 gap-6 relative z-10">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Utensils className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-500 font-serif italic tracking-wide">Savanna Grill</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-serif text-neutral-100 tracking-tight">
                Weekend <span className="font-sans font-black block text-5xl md:text-6xl uppercase text-neutral-300 mt-1">Menu</span>
              </h3>
              <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                <div className="h-px w-12 bg-amber-500/50" />
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                </div>
                <div className="h-px w-12 bg-amber-500/50" />
              </div>
            </div>

            {/* Embedded Visual Feature Card */}
            <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-neutral-800 shadow-xl rotate-2 group">
              <img
                src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80"
                alt="Signature Dish"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-3 text-[10px] font-black text-amber-400 uppercase tracking-widest">Chef's Feature</span>
            </div>
          </div>

          {/* Time of Day Two-Column Grid Alignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">

            {/* Breakfast Timeline Segment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Utensils className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="text-xl font-serif text-neutral-200 tracking-wide">Breakfast</h4>
              </div>
              <div className="space-y-5">
                {loading ? (
                  <p className="text-neutral-500 text-xs">Loading breakfast items...</p>
                ) : breakfastItems.length > 0 ? (
                  breakfastItems.map((item) => (
                    <MenuItemRow key={item.documentId} item={item} format={format} addItem={addItem} />
                  ))
                ) : (
                  <p className="text-neutral-500 text-xs">No breakfast items available</p>
                )}
              </div>
            </div>

            {/* Lunch Timeline Segment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Sun className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="text-xl font-serif text-neutral-200 tracking-wide">Lunch</h4>
              </div>
              <div className="space-y-5">
                {loading ? (
                  <p className="text-neutral-500 text-xs">Loading lunch items...</p>
                ) : lunchItems.length > 0 ? (
                  lunchItems.map((item) => (
                    <MenuItemRow key={item.documentId} item={item} format={format} addItem={addItem} />
                  ))
                ) : (
                  <p className="text-neutral-500 text-xs">No lunch items available</p>
                )}
              </div>
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
function MenuItemRow({ item, format, addItem }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="group flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-800/30 transition-colors"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-800">
        <img
          src={getCmsImageUrl(item.images || item.image, 'thumbnail')}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80'; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h5 className="text-sm font-bold text-neutral-200 group-hover:text-amber-400 transition-colors truncate">
            {item.name}
          </h5>
          <span className="text-sm font-black text-amber-500 whitespace-nowrap">
            {format(item.price)}
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2 mb-2">
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
            className="w-6 h-6 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-400 flex items-center justify-center transition-all"
          >
            <ShoppingBag className="w-3 h-3" />
          </button>
          <Link to={`/dish/${item.documentId || item.id}`} className="w-6 h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 flex items-center justify-center transition-all">
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
