import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Check, CheckCircle2, Clock3, MapPin, MessageCircle, Smartphone, Truck, Utensils,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatKES } from '@/utils/format';

const PAYMENT_DELAY_MS = 10 * 60 * 1000;
const STATUS_STEPS = [
  { id: 'pending', label: 'Order received' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'served', label: 'Served' },
];
const STATUS_INDEX = Object.fromEntries(STATUS_STEPS.map((step, index) => [step.id, index]));

function formatRemaining(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function ReceiptPage() {
  const { orderId } = useParams();
  const order = useOrderStore((state) => state.orders.find((item) => item.id === orderId));
  const updatePayment = useOrderStore((state) => state.updatePayment);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 pb-20 pt-28 text-center text-stone-900 dark:bg-neutral-950 dark:text-neutral-100">
        <h1 className="text-2xl font-black">Receipt not found</h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-neutral-400">This order may be from a different browser session.</p>
        <Link to="/orders" className="mt-5 inline-flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
          <ArrowLeft className="h-4 w-4" /> Go to order history
        </Link>
      </main>
    );
  }

  const paymentAvailableAt = order.servedAt ? order.servedAt + PAYMENT_DELAY_MS : null;
  const paymentAvailable = Boolean(paymentAvailableAt && now >= paymentAvailableAt);
  const countdown = paymentAvailableAt ? paymentAvailableAt - now : PAYMENT_DELAY_MS;
  const currentStep = STATUS_INDEX[order.status] ?? 0;
  const fulfillmentLabel = order.fulfillment === 'dine-in'
    ? `Dine in · Table ${order.tableId}`
    : order.fulfillment === 'delivery' ? 'Delivery' : 'Takeaway';
  const FulfillmentIcon = order.fulfillment === 'dine-in' ? Utensils : order.fulfillment === 'delivery' ? Truck : MapPin;
  const receiptMessage = [
    `Savanna Grill digital receipt`,
    `Order: ${order.id}`,
    `Customer: ${order.customerName}`,
    `Fulfillment: ${fulfillmentLabel}`,
    ...order.items.flatMap((item) => [
      `${item.qty} x ${item.name}${item.spiceLevel ? ` (${item.spiceLevel})` : ''}`,
      ...(item.addons || []).map((addon) => `  + ${addon.quantity} x ${addon.name}`),
      ...(item.specialInstructions ? [`  Note: ${item.specialInstructions}`] : []),
    ]),
    `Total: ${formatKES(order.total)}`,
    `Payment: ${order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'awaiting_confirmation' ? 'Awaiting staff confirmation' : order.paymentStatus === 'requested' ? 'Demo M-Pesa request' : 'Unpaid'}`,
  ].join('\n');
  const whatsappPhone = (order.customerPhone || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(receiptMessage)}`;

  const requestMpesaDemo = () => updatePayment(order.id, 'requested', 'mpesa-demo');
  const recordManualPayment = () => updatePayment(order.id, 'awaiting_confirmation', 'manual');

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-20 pt-28 text-stone-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-2xl">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-amber-600 dark:text-neutral-400 dark:hover:text-amber-400">
          <ArrowLeft className="h-4 w-4" /> Order history
        </Link>

        <section className="mt-5 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <header className="bg-amber-500 px-5 py-6 text-neutral-950 sm:px-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em]">Savanna Grill</p>
                <h1 className="mt-2 text-2xl font-black">Digital receipt</h1>
                <p className="mt-1 font-mono text-sm font-bold">{order.id}</p>
              </div>
              <CheckCircle2 className="h-9 w-9 shrink-0" />
            </div>
          </header>

          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">{order.customerName}</p>
                <p className="mt-1 text-xs text-stone-500 dark:text-neutral-400">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-bold dark:bg-neutral-800">
                <FulfillmentIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                {fulfillmentLabel}
              </div>
            </div>

            {order.fulfillment === 'delivery' && order.deliveryAddress && (
              <p className="rounded-xl bg-stone-100 p-3 text-sm dark:bg-neutral-800">
                <span className="font-bold">Delivery address:</span> {order.deliveryAddress}
              </p>
            )}

            <section aria-label="Order status">
              <h2 className="mb-4 text-sm font-black uppercase tracking-wide">Order progress</h2>
              <ol className="grid grid-cols-4 gap-2">
                {STATUS_STEPS.map((step, index) => {
                  const complete = index <= currentStep;
                  return (
                    <li key={step.id} className={`border-t-2 pt-2 text-[11px] font-semibold sm:text-xs ${complete ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-stone-200 text-stone-400 dark:border-neutral-700'}`}>
                      <span className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full ${complete ? 'bg-emerald-500 text-white' : 'bg-stone-200 dark:bg-neutral-700'}`}>
                        {complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      {step.label}
                    </li>
                  );
                })}
              </ol>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-black uppercase tracking-wide">Items</h2>
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li key={`${item.name}-${index}`} className="flex justify-between gap-4 text-sm">
                    <span className="min-w-0">
                      <strong>{item.qty}×</strong> {item.name}{item.spiceLevel ? ` · ${item.spiceLevel}` : ''}
                      {item.addons?.length > 0 && <span className="mt-1 block text-xs text-stone-500 dark:text-neutral-400">Extras: {item.addons.map((addon) => `${addon.quantity}× ${addon.name}`).join(', ')}</span>}
                      {item.specialInstructions && <span className="mt-1 block text-xs italic text-stone-500 dark:text-neutral-400">Note: {item.specialInstructions}</span>}
                    </span>
                    <span className="shrink-0 font-semibold">{formatKES(((item.price || 0) + (item.addons || []).reduce((sum, addon) => sum + addon.price * addon.quantity, 0)) * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-lg font-black dark:border-neutral-700">
                <span>Total</span><span>{formatKES(order.total)}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 p-4 dark:border-neutral-700">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-black">Payment</h2>
                  <p className="mt-1 text-xs text-stone-500 dark:text-neutral-400">
                    {order.paymentStatus === 'paid'
                      ? 'Payment confirmed by staff.'
                      : order.paymentStatus === 'awaiting_confirmation'
                        ? 'Manual payment is waiting for staff confirmation.'
                        : order.paymentStatus === 'requested'
                          ? 'Demo M-Pesa request recorded; no prompt was sent.'
                          : 'Payment is due after service.'}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'awaiting_confirmation' ? 'Checking' : order.paymentStatus === 'requested' ? 'Prompt requested' : 'Unpaid'}
                </span>
              </div>
              {!order.servedAt && order.paymentStatus !== 'paid' && (
                <p className="mt-3 flex items-center gap-2 text-xs text-stone-500 dark:text-neutral-400">
                  <Clock3 className="h-4 w-4" /> Payment options appear 10 minutes after staff marks this order served.
                </p>
              )}
              {order.servedAt && !paymentAvailable && order.paymentStatus !== 'paid' && (
                <p className="mt-3 flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400" aria-live="polite">
                  <Clock3 className="h-4 w-4" /> Payment available in {formatRemaining(countdown)}
                </p>
              )}
              {paymentAvailable && order.paymentStatus !== 'paid' && order.paymentStatus !== 'awaiting_confirmation' && order.paymentStatus !== 'requested' && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={requestMpesaDemo}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500"
                  >
                    <Smartphone className="h-4 w-4" />                     Try demo M-Pesa request
                  </button>
                  <button
                    type="button"
                    onClick={recordManualPayment}
                    className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-bold hover:border-amber-500 dark:border-neutral-700"
                  >
                    I paid manually
                  </button>
                </div>
              )}
              {order.paymentStatus === 'requested' && (
                <button type="button" onClick={() => updatePayment(order.id, 'unpaid', null)} className="mt-3 text-xs font-bold text-amber-700 underline dark:text-amber-400">
                  Retry demo request
                </button>
              )}
              {order.paymentStatus !== 'paid' && (
                <p className="mt-3 text-[11px] leading-relaxed text-stone-500 dark:text-neutral-400">
                  Local demo only: no real M-Pesa prompt or charge occurs. A secure server integration is required for live Daraja payments.
                </p>
              )}
            </section>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-green-500"
            >
              <MessageCircle className="h-5 w-5" /> Share receipt on WhatsApp
            </a>
            <p className="text-center text-[11px] text-stone-500 dark:text-neutral-400">
              WhatsApp opens a prefilled receipt; you must tap Send.
            </p>
          </div>
        </section>
        <p className="mt-4 text-center text-xs text-stone-500 dark:text-neutral-400">
          This receipt is stored in this browser session only.
        </p>
      </div>
    </main>
  );
}
