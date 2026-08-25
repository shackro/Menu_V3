import { Flame, Star } from 'lucide-react';
export default function StatusBadge({ badge }) {
  if (badge === 'best_seller') return <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10"><Flame className="w-3 h-3" /> Best Seller</span>;
  if (badge === 'chefs_choice') return <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10"><Star className="w-3 h-3 fill-current" /> Chef's Choice</span>;
  return null;
}
