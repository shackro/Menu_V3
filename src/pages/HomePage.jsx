import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Flame, ChefHat } from 'lucide-react';

// CMS & Utilities
import { fetchCategories, fetchMenuItems, getCmsImageUrl } from '@/api/cms';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import MenuList from '@/components/menu/MenuList';
import { useCurrency } from '@/context/CurrencyContext';
import FloatingCart from '@/components/cart/FloatingCart';

// UI Components
import Skeleton from '@/components/ui/Skeleton';
import StatusBadge from '@/components/ui/Badge';

const CHEF_QUOTES = [
  "Crafted with passion",
  "Where flavor meets tradition",
  "Every dish tells a story",
  "From our kitchen to your heart"
];

function getCategoryTagline(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('breakfast')) return 'Wake up happy ☀️';
  if (n.includes('lunch')) return 'Midday fuel 🥗';
  if (n.includes('dinner')) return 'Evening delights 🍷';
  if (n.includes('dessert')) return 'Sweet endings 🍰';
  if (n.includes('bar') || n.includes('cocktail')) return 'Shaken & stirred 🍸';
  if (n.includes('coffee') || n.includes('drink')) return 'A sip to remember ☕';
  return 'Farm to fork 🌱';
}

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  const containerRef = useRef(null);
  const { format } = useCurrency();
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % CHEF_QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(el.classList.contains('dark')));
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const lightHero = "https://images.pexels.com/photos/32972518/pexels-photo-32972518/free-photo-of-fresh-mint-cocktail-in-a-glass-on-table.jpeg?auto=format&fit=crop&q=80";
  const darkHero = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80";
  const heroBackgroundUrl = isDark ? darkHero : lightHero;
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, items] = await Promise.all([fetchCategories(), fetchMenuItems()]);
        setCategories(cats);
        setMenuItems(items || []);
        const bestSellers = (items || []).filter(i => i.status_badge === 'best_seller');
        setFeaturedItems(bestSellers.length > 0 ? bestSellers.slice(0, 3) : (items || []).filter(i => i.is_available).slice(0, 3));
      } catch (error) {
        console.error("Failed to load menu data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark p-8 space-y-12">
        <Skeleton className="h-[80vh] w-full rounded-3xl" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const heroWords = ["Every", "Single", "Day"];

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-dark overflow-x-hidden relative">
      
      {/* ================= IMMERSIVE HERO SECTION ================= */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />
          <img src={heroBackgroundUrl} alt="Restaurant Hero" className="w-full h-full object-cover scale-110" />
        </motion.div>

        {/* Dynamic Chef Profile Widget */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-20 left-4 md:left-8 z-30 flex flex-col items-center gap-2"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-500" />
            <img 
              src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80" 
              alt="Head Chef" 
              className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white/80 shadow-2xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="text-center md:text-left drop-shadow-lg max-w-[200px]">
            <p className="text-sm md:text-base font-bold text-white flex items-center justify-center md:justify-start gap-1.5">
              <ChefHat className="w-4 h-4 text-primary" /> Chef Marcus
            </p>
            <motion.p
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-xs text-white/80 italic leading-tight mt-0.5"
            >
              "{CHEF_QUOTES[currentQuoteIndex]}"
            </motion.p>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-6 border border-white/20">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">4.9 Google Rating</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Freshly Prepared <br />
              <span className="inline-block mt-2">
                {heroWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.6, ease: "easeOut" }}
                    className="inline-block mr-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Authentic Kenyan cuisine crafted with passion. Scan, browse, and order seamlessly straight to your table.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 1.4, type: "spring" }}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/menu" className="inline-flex items-center gap-2 px-10 py-5 bg-primary hover:bg-secondary text-white rounded-full font-bold text-lg transition-all shadow-2xl shadow-primary/30">
                View Menu <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION (Compact 1/4 Screen) ================= */}
      <section className="h-[25vh] min-h-[160px] px-4 py-2 bg-white dark:bg-dark-card flex flex-col justify-center overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-2"
          >
            <h2 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              Browse Categories
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2"
          >
            {categories.map((cat, index) => {
              const itemsForCat = (menuItems || []).filter(i => i?.category?.documentId === cat.documentId);
              return (
                <motion.div 
                  key={cat.documentId} 
                  variants={fadeInUp} 
                  custom={index} 
                  whileHover={{ y: -2, scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="cursor-pointer"
                >
                  <Link to={`/menu?category=${cat.documentId}`} className="block h-full">
                    <div className="bg-gray-50 dark:bg-dark rounded-lg p-2 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center h-full justify-center">
                      
                      {/* Ultra-Compact Icon */}
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-1 shadow-inner border border-primary/10 dark:border-primary/20">
                        <span className="text-lg drop-shadow-sm select-none">
                          {cat.icon_emoji || '🍽️'}
                        </span>
                      </div>
                      
                      {/* Micro Typography */}
                      <h3 className="text-[10px] md:text-xs font-bold text-gray-900 dark:text-white line-clamp-1 leading-tight w-full px-1">
                        {cat.name}
                      </h3>
                      <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                        {itemsForCat.length} item{itemsForCat.length !== 1 ? 's' : ''}
                      </span>
                      
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= WEEKEND MENU LIST SECTION ================= */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Full Weekend Menu</h2>
            <p className="text-gray-600 dark:text-gray-400">Browse our complete offerings by meal time</p>
          </motion.div>
          <MenuList />
        </div>
      </section>

      {/* ================= FEATURED / BEST SELLERS SECTION ================= */}
      {featuredItems.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-dark-card rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full mb-4">
                <Flame className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm uppercase tracking-wider">Customer Favorites</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Best Sellers</h2>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <motion.div key={item.documentId} variants={fadeInUp} whileHover={{ y: -10 }} className="group">
                  <Link to={`/dish/${item.documentId}`} className="block h-full">
                    <div className="bg-gray-50 dark:bg-dark rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full flex flex-col border border-gray-100 dark:border-gray-800">
                      <div className="relative h-64 overflow-hidden">
                        <StatusBadge badge={item.status_badge} />
                        
                        {/* ✅ UPDATED: Safely handles both mock data 'images' array and CMS 'image' object */}
                        <img 
                          src={getCmsImageUrl(item.images || item.image, 'medium')} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'; }}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">{item.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                          <span className="text-2xl font-extrabold text-primary">{format(item.price)}</span>
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ================= FLOATING CART (Bottom-Left Slide Up) ================= */}
      <FloatingCart />
    </div>
  );
}