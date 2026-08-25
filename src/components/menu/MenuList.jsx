import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchMenuItems, getCmsImageUrl } from '@/api/cms';
import { useCurrency } from '@/context/CurrencyContext';
import { useCartStore } from '@/store/useCart';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

// ==========================================
// Compact Component specifically for the Weekend Menu List
// (This does NOT affect your main MenuItemCard.jsx)
// ==========================================
function MenuListItem({ item, format, onQuickAdd }) {
  const imageData = item.images ? item.images : item.image;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-dotted border-[rgba(219,165,60,0.35)] last:border-0">
      {/* Tiny Picture: 32x32px */}
      {imageData && (
        <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden bg-[#1c1c1c] border border-[rgba(219,165,60,0.2)]">
          <img 
            src={getCmsImageUrl(imageData, 'thumbnail')} 
            alt={item.name} 
            className="w-full h-full object-cover" 
            loading="lazy" 
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {/* Name and Price with Dotted Leader */}
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm text-[#f3efe6] truncate">
            {item.name}
          </span>
          <span className="flex-1 min-w-4 border-b border-dotted border-[rgba(219,165,60,0.35)] translate-y-[-3px]" />
          <span className="text-sm text-[#dba53c] font-bold whitespace-nowrap">
            {format(item.price)}
          </span>
        </div>
        
        {/* Description */}
        <p className="mt-1 text-xs leading-relaxed text-[#a8a29a] line-clamp-2">
          {item.description}
        </p>
        
        {/* Micro Icon Buttons: 24x24px (Minimum usable tap target) */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickAdd(item);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-[#dba53c] hover:bg-[#c9952f] text-[#0a0a0a] transition-colors active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
          <a
            href={`/dish/${item.documentId || item.id}`}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-[rgba(219,165,60,0.15)] hover:bg-[rgba(219,165,60,0.25)] text-[#dba53c] transition-colors active:scale-95"
            aria-label="See more details"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main MenuList Component
// ==========================================
export default function MenuList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { format } = useCurrency();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadData() {
      try {
        const allItems = await fetchMenuItems();
        const grouped = { breakfast: [], lunch: [], dinner: [] };
        
        allItems.filter(i => i.is_available).forEach(item => {
          const categoryName = item.category?.name?.toLowerCase() || '';
          if (categoryName.includes('breakfast')) {
            grouped.breakfast.push(item);
          } else if (categoryName.includes('lunch')) {
            grouped.lunch.push(item);
          } else if (categoryName.includes('dinner')) {
            grouped.dinner.push(item);
          }
        });

        Object.keys(grouped).forEach(key => 
          grouped[key].sort((a, b) => a.name.localeCompare(b.name))
        );

        setItems(grouped);
      } catch (error) {
        console.error('Failed to load weekend menu:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickAdd = (item) => {
    addItem({
      dishId: item.documentId || item.id,
      name: item.name,
      price: item.price,
      image: item.image ? getCmsImageUrl(item.image, 'thumbnail') : undefined,
      quantity: 1,
      spiceLevel: item.spice_level ? item.spice_level.charAt(0).toUpperCase() + item.spice_level.slice(1) : 'Mild',
      specialInstructions: '',
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-6">
            <Skeleton className="h-8 w-40" />
            {[1, 2, 3, 4].map(j => <Skeleton key={j} className="h-32 rounded-2xl" />)}
          </div>
        ))}
      </div>
    );
  }

  const sections = [
    { id: 'breakfast', title: 'Breakfast', icon: '🍳' },
    { id: 'lunch', title: 'Lunch', icon: '☀️' },
    { id: 'dinner', title: 'Dinner', icon: '🌙' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3efe6] font-sans py-4 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto bg-[radial-gradient(ellipse_at_15%_0%,rgba(219,165,60,0.10),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgba(219,165,60,0.08),transparent_55%),#141414] border border-[rgba(219,165,60,0.28)] rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.65),0_0_0_1px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="p-5 sm:p-8 md:p-12">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 flex-shrink-0 text-[#dba53c]">
              <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.15"/>
              <path d="M14 8v14a4 4 0 0 0 8 0V8M18 8v10M14 22v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M32 8c-3 0-5 4-5 9s2 7 5 7v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-['Yellowtail'] text-[clamp(1.5rem,4vw,2.1rem)] text-[#f1c874]">Savanna Grill</span>
          </div>

          {/* Hero Section */}
          <section className="flex flex-col items-center gap-4 pb-6 sm:pb-8 text-center sm:text-left sm:flex-row sm:justify-between">
            <div className="flex-1">
              <div className="font-['Yellowtail'] text-[clamp(1.7rem,5vw,2.6rem)] text-[#f1c874] mb-[-10px]">Weekend</div>
              <h1 className="font-['Playfair_Display'] font-black tracking-[0.08em] text-[clamp(2.6rem,11vw,4.6rem)] leading-none">MENU</h1>
              <svg viewBox="0 0 220 24" fill="none" className="w-[clamp(150px,40vw,220px)] text-[#dba53c] mt-3 mx-auto sm:mx-0">
                <line x1="0" y1="12" x2="80" y2="12" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="95" cy="12" r="2.5" fill="currentColor"/>
                <circle cx="110" cy="12" r="2.5" fill="currentColor"/>
                <circle cx="125" cy="12" r="2.5" fill="currentColor"/>
                <line x1="140" y1="12" x2="220" y2="12" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="hidden md:block">
              {items.breakfast[0]?.image && (
                <img 
                  src={getCmsImageUrl(items.breakfast[0].image, 'medium')} 
                  alt="Chef's signature plate" 
                  className="w-[230px] aspect-[4/3] object-cover rounded-lg border border-[rgba(219,165,60,0.2)] shadow-lg"
                />
              )}
            </div>
          </section>

          {/* Menu Columns - Desktop */}
          <div className="hidden lg:flex flex-row">
            {sections.map((section, sectionIdx) => (
              <div key={section.id} className="flex-1 py-4 px-5 first:pl-0 last:pr-0">
                <h2 className="font-['Yellowtail'] text-[#f1c874] text-[clamp(1.5rem,4vw,1.9rem)] text-center mb-4">
                  {section.icon} {section.title}
                </h2>
                {items[section.id]?.length > 0 ? (
                  items[section.id].map((item) => (
                    <MenuListItem 
                      key={item.documentId || item.id} 
                      item={item} 
                      format={format}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No items available</p>
                )}
                
                {/* Vertical Divider between columns */}
                {sectionIdx < sections.length - 1 && (
                  <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[26px] justify-center pt-10 pointer-events-none">
                    <svg viewBox="0 0 24 480" preserveAspectRatio="none" className="w-full min-h-[460px] text-[#dba53c] opacity-85">
                      <line x1="12" y1="0" x2="12" y2="480" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="70" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="220" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="350" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile View - Stacked Sections */}
          <div className="lg:hidden space-y-8">
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="font-['Yellowtail'] text-[#f1c874] text-[clamp(1.5rem,4vw,1.9rem)] text-center mb-4">
                  {section.icon} {section.title}
                </h2>
                <div className="space-y-1">
                  {items[section.id]?.length > 0 ? (
                    items[section.id].map((item) => (
                      <MenuListItem 
                        key={item.documentId || item.id} 
                        item={item} 
                        format={format}
                        onQuickAdd={handleQuickAdd}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items available</p>
                  )}
                </div>
                
                {/* Mobile horizontal divider */}
                {section.id !== 'dinner' && (
                  <div className="flex items-center gap-2.5 py-4 text-[#dba53c]">
                    <div className="flex-1 h-px bg-[rgba(219,165,60,0.35)]" />
                    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <div className="flex-1 h-px bg-[rgba(219,165,60,0.35)]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="border-t border-[rgba(219,165,60,0.35)] pt-5 sm:pt-7 text-center mt-4">
            <p className="font-bold tracking-[0.16em] text-[#dba53c] text-[clamp(0.78rem,2.4vw,0.9rem)] mb-1.5">DELIVERY AVAILABLE</p>
            <p className="font-['Playfair_Display'] font-bold text-[clamp(1.15rem,4vw,1.6rem)]">CALL +254 703 412 694</p>
          </footer>

        </div>
      </div>
    </div>
  );
}