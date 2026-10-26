import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChefHat, Clock3, LayoutGrid, Lock, Users } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatKES } from '@/utils/format';

const COLUMNS = [
  { id: 'pending', title: 'Pending', icon: AlertCircle, color: 'text-red-500', tint: 'bg-red-500/10' },
  { id: 'preparing', title: 'Preparing', icon: ChefHat, color: 'text-amber-500', tint: 'bg-amber-500/10' },
  { id: 'ready', title: 'Ready', icon: CheckCircle2, color: 'text-emerald-500', tint: 'bg-emerald-500/10' },
  { id: 'served', title: 'Served', icon: CheckCircle2, color: 'text-sky-500', tint: 'bg-sky-500/10' },
];

const NEXT_STATUS = { pending: 'preparing', preparing: 'ready', ready: 'served' };

function elapsedTime(timestamp, now) {
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60000));
  return minutes < 1 ? 'Just now' : `${minutes}m ago`;
}

export default function StaffDashboard() {
  const orders = useOrderStore((state) => state.orders);
  const updateStatus = useOrderStore((state) => state.updateStatus);
  const updatePayment = useOrderStore((state) => state.updatePayment);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    activeTables: new Set(orders
      .filter((order) => order.status !== 'served'
        && order.tableId
        && (order.fulfillment === 'dine-in' || (!order.fulfillment && order.tableId !== 'Takeaway')))
      .map((order) => order.tableId)).size,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  }), [orders]);

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8 text-stone-900 dark:bg-neutral-950 dark:text-neutral-100 md:px-6">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight">
              <LayoutGrid className="h-6 w-6 text-amber-500" /> Staff Command Center
            </h1>
            <p className="mt-1 text-xs text-stone-500 dark:text-neutral-400">Savanna Grill · Kitchen order board</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/staff/login" className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold transition hover:border-amber-500 dark:border-neutral-700">
              <Lock className="h-3.5 w-3.5" /> Staff sign-in preview
            </Link>
            <span className="w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
              LOCAL DEMO · NOT PROTECTED
            </span>
          </div>
        </header>

        <p className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-stone-600 dark:text-neutral-400">
          This frontend-only preview stores orders in this browser tab's session. It has no staff authentication, backend, live payments, or cross-device synchronization and must not be used for live operations.
        </p>

        <section aria-label="Order statistics" className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Orders" value={stats.total} icon={LayoutGrid} />
          <Stat label="Pending" value={stats.pending} icon={AlertCircle} />
          <Stat label="Active tables" value={stats.activeTables} icon={Users} />
          <Stat label="Order value" value={formatKES(stats.revenue)} icon={CheckCircle2} />
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {COLUMNS.map((column) => {
            const Icon = column.icon;
            const columnOrders = orders.filter((order) => order.status === column.id);
            return (
              <section key={column.id} aria-labelledby={`staff-${column.id}`} className="min-w-0">
                <header className="mb-3 flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <h2 id={`staff-${column.id}`} className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
                    <span className={`rounded-lg p-1.5 ${column.tint}`}><Icon className={`h-4 w-4 ${column.color}`} /></span>
                    {column.title}
                  </h2>
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold dark:bg-neutral-800">{columnOrders.length}</span>
                </header>
                <div className="space-y-3">
                  {columnOrders.map((order) => (
                    <motion.article layout key={order.id} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs font-bold">{order.id}</p>
                          <p className="mt-1 text-sm font-bold">{order.customerName}</p>
                          {order.customerPhone && <p className="mt-0.5 text-[11px] text-stone-500 dark:text-neutral-400">{order.customerPhone}</p>}
                          {order.status === 'pending' && (
                            <p className="mt-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                              Browser demo order
                            </p>
                          )}
                        </div>
                        <span className={`flex shrink-0 items-center gap-1 text-xs ${column.id === 'pending' && now - order.createdAt > 600000 ? 'text-red-500' : 'text-stone-500 dark:text-neutral-400'}`}>
                          <Clock3 className="h-3.5 w-3.5" />{elapsedTime(order.createdAt, now)}
                        </span>
                      </div>
                      <p className="mb-3 rounded-lg bg-stone-100 px-3 py-2 text-xs font-bold dark:bg-neutral-800">
                        {order.fulfillment === 'dine-in' || (!order.fulfillment && order.tableId !== 'Takeaway')
                          ? `Dine in · Table ${order.tableId}`
                          : order.fulfillment === 'delivery' ? 'Delivery' : 'Takeaway'}
                      </p>
                      {order.deliveryAddress && (
                        <p className="mb-3 text-xs text-stone-500 dark:text-neutral-400">Deliver to: {order.deliveryAddress}</p>
                      )}
                      <ul className="space-y-2 border-t border-stone-100 pt-3 dark:border-neutral-800">
                        {order.items.map((item, index) => (
                          <li key={`${item.name}-${index}`} className="text-xs">
                            <span className="mr-1 font-black">{item.qty}×</span>{item.name}
                            {item.spiceLevel && <span className="ml-1 text-stone-500">({item.spiceLevel})</span>}
                            {item.specialInstructions && <p className="ml-4 mt-1 italic text-stone-500">{item.specialInstructions}</p>}
                            {item.addons?.length > 0 && <p className="ml-4 mt-1 text-stone-500">Extras: {item.addons.map((addon) => addon.name).join(', ')}</p>}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3 text-sm dark:border-neutral-800">
                        <span className="text-stone-500 dark:text-neutral-400">Total</span>
                        <span className="font-black text-amber-600 dark:text-amber-400">{formatKES(order.total)}</span>
                      </div>
                      <p className="mt-2 text-xs text-stone-500 dark:text-neutral-400">
                        Payment: {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'awaiting_confirmation' ? 'Manual payment awaiting confirmation' : order.paymentStatus === 'requested' ? 'Demo M-Pesa request' : 'Unpaid'}
                      </p>
                      {order.paymentStatus !== 'paid' && order.paymentStatus !== 'unpaid' && (
                        <button
                          type="button"
                          onClick={() => updatePayment(order.id, 'paid', order.paymentMethod)}
                          className="mt-2 w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400"
                        >
                          Confirm payment (demo)
                        </button>
                      )}
                      {NEXT_STATUS[order.status] && (
                        <button
                          type="button"
                          onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                          className="mt-3 w-full rounded-lg bg-stone-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-amber-600 dark:bg-white dark:text-neutral-950 dark:hover:bg-amber-400"
                        >
                          Move to {NEXT_STATUS[order.status]}
                        </button>
                      )}
                    </motion.article>
                  ))}
                  {columnOrders.length === 0 && (
                    <p className="rounded-xl border-2 border-dashed border-stone-200 py-8 text-center text-xs text-stone-400 dark:border-neutral-800">
                      No orders
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-500">{label}</p>
        <p className="mt-1 text-xl font-black">{value}</p>
      </div>
      <Icon className="h-5 w-5 text-amber-500" />
    </div>
  );
}
