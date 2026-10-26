import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Clock3 } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatKES } from '@/utils/format';

const STATUS_LABELS = {
  pending: 'Received',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
};

export default function OrdersPage() {
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="min-h-screen bg-stone-50 px-4 pb-20 pt-28 text-stone-900 dark:bg-neutral-950 dark:text-neutral-100">
      <main className="mx-auto max-w-3xl">
        <header className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Your digital receipts</p>
          <h1 className="mt-2 text-3xl font-black">Order history</h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-neutral-400">Orders placed in this browser session.</p>
        </header>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <ClipboardList className="mx-auto h-10 w-10 text-amber-500" />
            <h2 className="mt-4 text-lg font-bold">No orders yet</h2>
            <p className="mt-2 text-sm text-stone-500 dark:text-neutral-400">Browse the menu and your digital receipts will appear here.</p>
            <Link to="/menu" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-neutral-950">
              Browse menu <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-bold text-stone-500 dark:text-neutral-400">{order.id}</p>
                    <h2 className="mt-1 font-bold">
                      {order.fulfillment === 'dine-in'
                        ? `Dine in · Table ${order.tableId}`
                        : order.fulfillment === 'delivery' ? 'Delivery' : 'Takeaway'}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500 dark:text-neutral-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-neutral-800">
                  <span className="text-sm font-bold">{formatKES(order.total)}</span>
                  <Link to={`/receipt/${order.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-600 dark:text-amber-400">
                    View receipt <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="mt-7 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-stone-600 dark:text-neutral-400">
          Demo note: order history is stored only in this browser session and is not shared with other devices.
        </p>
      </main>
    </div>
  );
}
