import { MessageCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCart';
import { useUserStore } from '@/store/useUser';
import { useState, useMemo } from 'react';
import { generateWhatsAppMessage } from '@/utils/whatsappFormatter';
import { formatKES } from '@/utils/format';

export default function WhatsAppCheckout() {
  const items = useCartStore((state) => state.items);
  const tableId = useCartStore((state) => state.tableId);
  const getTotal = useCartStore((state) => state.getTotal);
  const { phoneNumber, recordOrder } = useUserStore();
  const total = getTotal();
  const [isSending, setIsSending] = useState(false);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return '#';
    const cafePhone = "254703412694"; // Replace with actual restaurant number
    const encodedMsg = generateWhatsAppMessage(items, tableId, total);
    return `https://wa.me/${cafePhone}?text=${encodedMsg}`;
  }, [items, tableId, total]);

  const handleCheckout = (e) => {
    recordOrder(total);
    setIsSending(true);
    setTimeout(() => setIsSending(false), 1500);
  };

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={handleCheckout} 
      className="sticky bottom-4 mt-5 w-full md:max-w-md md:mx-auto py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl no-underline"
    >
      {isSending ? (
        <><Loader2 className="w-6 h-6 animate-spin" /> Preparing Order...</>
      ) : (
        <><MessageCircle className="w-6 h-6" /> Send Order via WhatsApp • {formatKES(total)}</>
      )}
    </a>
  );
}
