import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

import { fetchCategories, fetchMenuItems } from '@/api/cms';
import MenuItemCard from '@/components/menu/MenuItemCard';
import CategoryTabs from '@/components/menu/CategoryTabs';
import Skeleton from '@/components/ui/Skeleton';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const containerRef = useRef(null);
  
  // ✅ FIX: Added layoutEffect: false to prevent Framer Motion hydration warning
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end start"],
    layoutEffect: false 
  });
  
  const navOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, items] = await Promise.all([
          fetchCategories(),
          fetchMenuItems()
        ]);
        setCategories(cats || []);
        setMenuItems(items || []);
      } catch (error) {
        console.error("Failed to load menu data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync active category with URL
  useEffect(() => {
    if (activeCategory === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', activeCategory);
    }
    setSearchParams(searchParams, { replace: true });
  }, [activeCategory, searchParams, setSearchParams]);

  // Robust Filtering Logic
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (!item.is_available) return false;
      
      const matchesCategory = activeCategory === 'all' || 
                              item.category?.documentId === activeCategory || 
                              item.category?.name === activeCategory;
      
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  if (loading) {
    return (
      <div className="pt-32 px-4 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-full rounded-full" />
        <div className="flex gap-2"><Skeleton className="h-10 w-24 rounded-full" /><Skeleton className="h-10 w-24 rounded-full" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
      
      {/* ================= STICKY SEARCH & CATEGORY TABS ================= */}
      <motion.div 
        style={{ opacity: navOpacity }} 
        className="sticky top-16 z-40 bg-gray-50/95 dark:bg-dark/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 p-4 transition-opacity"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search dishes, drinks, or services..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
            />
          </div>
          
          {/* Horizontal Scrolling Category Tabs */}
          <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </motion.div>

      {/* ================= MENU GRID ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                // ✅ FIX: Use unique documentId to prevent React duplicate key warnings
                key={item.documentId || item.id || `item-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}