import { useRef, useEffect } from 'react';

const CATEGORY_ICONS = {
  'breakfast': '🍳', 'lunch': '☀️', 'dinner': '🍽️', 'desserts': '🍰',
  'bar & cocktails': '🍸', 'coffee & drinks': '☕', 'spa & wellness': '💆‍♀️',
  'room service': '🛎️', 'concierge & events': '🥂', 'drinks & bar': '🍹'
};

const getCategoryIcon = (name) => {
  if (!name) return '🍽️';
  const normalizedName = name.toLowerCase().trim();
  return CATEGORY_ICONS[normalizedName] || '🍽️';
};

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);

  // Auto-scroll to active category when it changes
  useEffect(() => {
    if (scrollRef.current && activeCategory !== 'all') {
      const activeBtn = scrollRef.current.querySelector(`[data-id="${activeCategory}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  return (
    <div 
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
    >
      <button
        type="button"
        onClick={() => onCategoryChange('all')}
        data-id="all"
        aria-pressed={activeCategory === 'all'}
        className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all snap-start flex items-center gap-2 shrink-0 ${
          activeCategory === 'all' 
            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <span>🍽️</span> All
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.documentId || cat.id}
          type="button"
          data-id={cat.documentId || cat.name}
          onClick={() => onCategoryChange(cat.documentId || cat.name)}
          aria-pressed={activeCategory === (cat.documentId || cat.name)}
          className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all snap-start flex items-center gap-2 shrink-0 ${
            activeCategory === (cat.documentId || cat.name)
              ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
              : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span>{cat.icon_emoji || getCategoryIcon(cat.name)}</span> 
          {cat.name}
        </button>
      ))}
    </div>
  );
}