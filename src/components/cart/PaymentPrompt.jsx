import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BellRing } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatKES } from '@/utils/format';

const PAYMENT_DELAY_MS = 10 * 60 * 1000;

export default function PaymentPrompt() {
  const orders = useOrderStore((state) => state.orders);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(interval);
  }, []);

  const payableOrder = orders.find((order) =>
    order.servedAt
    && now - order.servedAt >= PAYMENT_DELAY_MS
    && !['paid', 'requested', 'awaiting_confirmation'].includes(order.paymentStatus)
  );

  if (!payableOrder) return null;

  return (
    <Link
      to={`/receipt/${payableOrder.id}`}
      className="fixed bottom-24 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-600 px-4 py-3 text-white shadow-2xl shadow-emerald-900/20 transition hover:bg-emerald-500 sm:bottom-6 sm:right-6"
      aria-label={`Payment is ready for order ${payableOrder.id}, ${formatKES(payableOrder.total)}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
        <BellRing className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-wide">Payment is ready</span>
        <span className="block truncate text-[11px] text-emerald-50">{payableOrder.id} · {formatKES(payableOrder.total)}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}
