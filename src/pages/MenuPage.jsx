import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const categorySectionRefs = useRef({});
  
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

  // Keep the selected filter in sync with browser back/forward navigation.
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'all';
    if (urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    if (loading || !categories.length) return undefined;

    const root = document.documentElement;
    const previousScrollSnapType = root.style.scrollSnapType;
    root.style.scrollSnapType = 'y proximity';

    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const currentSection = visibleSections[0];

      if (currentSection) {
        setActiveCategory(currentSection.target.dataset.categoryId);
      }
    }, {
      rootMargin: '-170px 0px -55% 0px',
      threshold: 0,
    });

    Object.values(categorySectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
      root.style.scrollSnapType = previousScrollSnapType;
    };
  }, [categories, loading, searchQuery]);

  useEffect(() => {
    if (loading) return;
    const category = categories.find((item) => (
      (item.documentId || item.name) === activeCategory
    ));

    if (category) {
      categorySectionRefs.current[activeCategory]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [loading]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const nextSearchParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      nextSearchParams.delete('category');
    } else {
      nextSearchParams.set('category', category);
    }

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }

    if (category === 'all') {
      document.getElementById('menu-categories')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    categorySectionRefs.current[category]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Search across all categories; the category controls jump to sections.
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (!item.is_available) return false;

      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesSearch;
    });
  }, [menuItems, searchQuery]);

  const categorySections = useMemo(() => categories.map((category) => ({
    category,
    id: category.documentId || category.name,
    items: filteredItems.filter((item) => (
      (category.documentId && item.category?.documentId === category.documentId) ||
      item.category?.name === category.name
    )),
  })).filter((section) => section.items.length > 0), [categories, filteredItems]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
      
      {/* ================= STICKY SEARCH & CATEGORY TABS ================= */}
      <div className="sticky top-16 z-40 border-b border-gray-200 bg-gray-50/95 p-4 backdrop-blur-lg dark:border-gray-800 dark:bg-dark/95">
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
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* ================= MENU GRID ================= */}
      <div id="menu-categories" className="max-w-7xl mx-auto py-8 pl-4 pr-12 scroll-mt-40 sm:px-4">
        {categorySections.map(({ category, id, items }) => (
          <section
            key={id}
            id={`menu-category-${id}`}
            data-category-id={id}
            ref={(element) => { categorySectionRefs.current[id] = element; }}
            className="mb-14 scroll-mt-40 snap-start"
          >
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">
              <span aria-hidden="true">{category.icon_emoji || '🍽️'}</span>
              {category.name}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ({items.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.documentId || item.id || 'item'}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.35 }}
                  whileHover={{ y: -5 }}
                >
                  <MenuItemCard item={item} />
                </motion.div>
              ))}
            </div>
          </section>
        ))}
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
          </motion.div>
        )}
      </div>
      {categorySections.length > 1 && (
        <ScrollProgressRail
          categories={categories}
          activeCategory={activeCategory}
        />
      )}
    </div>
  );
}

function ScrollProgressRail({ categories, activeCategory }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const railRef = useRef(null);
  const activeCategoryName = categories.find(
    (category) => (category.documentId || category.name) === activeCategory
  )?.name || 'Menu';

  useEffect(() => {
    const updateScrollPosition = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setProgress(Math.min(1, Math.max(0, scrollProgress)));
      setIsVisible(maxScroll > 0 && window.scrollY > 180);
    };

    updateScrollPosition();
    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    window.addEventListener('resize', updateScrollPosition);

    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
      window.removeEventListener('resize', updateScrollPosition);
    };
  }, []);

  const scrollToProgress = (clientY) => {
    const rail = railRef.current;
    if (!rail) return;
    const { top, height } = rail.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - top) / height));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, ratio * maxScroll);
  };

  const handleKeyDown = (event) => {
    const increments = {
      ArrowUp: -0.05,
      ArrowDown: 0.05,
      PageUp: -0.15,
      PageDown: 0.15,
      Home: -1,
      End: 1,
    };
    const increment = increments[event.key];
    if (increment === undefined) return;
    event.preventDefault();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.min(maxScroll, Math.max(0, (progress + increment) * maxScroll)));
  };

  return (
    <motion.aside
      aria-label="Page scroll navigator"
      initial={false}
      animate={{
        opacity: isVisible ? (isDragging ? 1 : 0.55) : 0,
        x: isVisible ? 0 : 12,
      }}
      transition={{ duration: 0.25 }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      className="fixed right-1 top-1/2 z-40 -translate-y-1/2 sm:right-2"
    >
      <div className={`flex flex-col items-center gap-2 rounded-full border px-1.5 py-3 shadow-lg backdrop-blur-md transition-colors ${
        isDragging
          ? 'border-amber-500/50 bg-white/95 dark:bg-neutral-900/95'
          : 'border-stone-200/70 bg-white/55 dark:border-neutral-800/70 dark:bg-neutral-900/55'
      }`}>
        <span className="text-[9px] font-bold tabular-nums text-stone-500 dark:text-neutral-400">
          {Math.round(progress * 100)}%
        </span>
        <div
          ref={railRef}
          role="slider"
          tabIndex={isVisible ? 0 : -1}
          aria-label={`Page scroll position, ${activeCategoryName}`}
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
            scrollToProgress(event.clientY);
          }}
          onPointerMove={(event) => {
            if (isDragging) scrollToProgress(event.clientY);
          }}
          onPointerUp={() => setIsDragging(false)}
          onPointerCancel={() => setIsDragging(false)}
          onKeyDown={handleKeyDown}
          className="relative flex h-36 w-7 touch-none cursor-ns-resize items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-amber-500 sm:h-44"
        >
          <div className="absolute inset-y-1 left-1/2 w-1 -translate-x-1/2 rounded-full bg-stone-300/70 dark:bg-neutral-700/80" />
          <div
            className="absolute left-1/2 top-1 -translate-x-1/2 rounded-full bg-amber-500/80"
            style={{ height: `${Math.max(0, progress * 100)}%`, width: '3px' }}
          />
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                progress >= (index + 1) / 7
                  ? 'bg-amber-500'
                  : 'bg-stone-400/70 dark:bg-neutral-500'
              }`}
              style={{ top: `${((index + 1) / 7) * 100}%` }}
            />
          ))}
          <span
            className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-amber-500 shadow-md dark:border-neutral-900"
            style={{ top: `calc(${progress * 100}% - 7px)` }}
          />
        </div>
        <span className="max-w-9 truncate text-[8px] font-semibold text-stone-500 dark:text-neutral-400" title={activeCategoryName}>
          {activeCategoryName}
        </span>
      </div>
    </motion.aside>
  );
}