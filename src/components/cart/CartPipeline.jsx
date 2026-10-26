import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Check, CheckCircle2, MapPin, MessageCircle, Minus, Plus, ShoppingBag,
  Store, Trash2, Truck, Utensils, User, X,
} from 'lucide-react';
import { brandData } from '@/api/cms';
import { useCartStore } from '@/store/useCart';
import { useOrderStore } from '@/store/useOrderStore';
import { useCurrency } from '@/context/CurrencyContext';

const EMPTY_FORM = { name: '', phone: '', address: '' };
const CUSTOMER_PROFILE_KEY = 'savanna-customer-profile';
const FULFILLMENT_OPTIONS = [
  { id: 'dine-in', label: 'Dine in', detail: 'Enjoy your meal at a table', icon: Utensils },
  { id: 'takeaway', label: 'Takeaway', detail: 'Pick up your order', icon: Store },
  { id: 'delivery', label: 'Delivery', detail: 'Deliver to your address', icon: Truck },
];

export default function CartPipeline() {
  const location = useLocation();
  const navigate = useNavigate();
  const isStaffPage = location.pathname.startsWith('/staff');
  const items = useCartStore((state) => state.items);
  const tableId = useCartStore((state) => state.tableId);
  const setTableId = useCartStore((state) => state.setTableId);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const emptyCart = useCartStore((state) => state.emptyCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const addOrder = useOrderStore((state) => state.addOrder);
  const { format } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step, setStep] = useState('cart');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fulfillment, setFulfillment] = useState(tableId ? 'dine-in' : 'takeaway');
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [completedCustomerName, setCompletedCustomerName] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [rememberDetails, setRememberDetails] = useState(false);
  const [hasSavedDetails, setHasSavedDetails] = useState(false);
  const [confirmEmptyCart, setConfirmEmptyCart] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();
  const locationTableId = useMemo(
    () => new URLSearchParams(location.search).get('table'),
    [location.search]
  );

  useEffect(() => {
    if (locationTableId?.trim()) {
      setTableId(locationTableId.trim());
      setFulfillment('dine-in');
    }
  }, [locationTableId, setTableId]);

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem(CUSTOMER_PROFILE_KEY);
      if (!savedProfile) return;
      const profile = JSON.parse(savedProfile);
      if (
        !profile
        || typeof profile.name !== 'string'
        || typeof profile.phone !== 'string'
        || typeof profile.address !== 'string'
      ) {
        setError('Saved checkout details are invalid. You can remove them and enter your details again.');
        return;
      }
      setFormData({ name: profile.name, phone: profile.phone, address: profile.address });
      setRememberDetails(true);
      setHasSavedDetails(true);
    } catch (storageError) {
      if (!(storageError instanceof SyntaxError) && !(storageError instanceof DOMException)) {
        throw storageError;
      }
      setError('Saved checkout details could not be loaded. You can continue without remembering details.');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsDark(root.classList.contains('dark'));
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const openCart = () => {
      if (!isStaffPage) setIsOpen(true);
    };
    window.addEventListener('savanna:open-cart', openCart);
    return () => window.removeEventListener('savanna:open-cart', openCart);
  }, [isStaffPage]);

  useEffect(() => {
    if (isStaffPage) {
      setIsOpen(false);
      setShowConfirmation(false);
      setStep('cart');
    }
  }, [isStaffPage]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setStep('cart');
        setError('');
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setError('');
    setConfirmEmptyCart(false);
    window.setTimeout(() => setStep('cart'), 250);
  };

  const forgetSavedDetails = () => {
    try {
      window.localStorage.removeItem(CUSTOMER_PROFILE_KEY);
      setHasSavedDetails(false);
      setRememberDetails(false);
      setFormData(EMPTY_FORM);
      setError('');
    } catch (storageError) {
      if (!(storageError instanceof DOMException)) {
        throw storageError;
      }
      setError('Saved details could not be removed from this device. Please try again.');
    }
  };

  const handleCheckout = (event) => {
    event.preventDefault();
    setError('');
    if (!navigator.onLine) {
      setError('You are offline. Reconnect before placing your order.');
      return;
    }
    if (fulfillment === 'dine-in' && !tableId?.trim()) {
      setError('Enter your table number, or scan the table QR code before ordering.');
      return;
    }
    if (fulfillment === 'delivery' && !formData.address.trim()) {
      setError('Enter the delivery address for this order.');
      return;
    }

    try {
      if (rememberDetails) {
        window.localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        }));
        setHasSavedDetails(true);
      } else {
        window.localStorage.removeItem(CUSTOMER_PROFILE_KEY);
        setHasSavedDetails(false);
      }
    } catch (storageError) {
      if (!(storageError instanceof DOMException)) {
        throw storageError;
      }
      setError('Your details could not be saved on this device. Turn off “Remember my details” to continue.');
      return;
    }

    const customerName = formData.name.trim();
    const createdOrderId = addOrder({
      tableId: fulfillment === 'dine-in' ? tableId.trim() : '',
      fulfillment,
      deliveryAddress: fulfillment === 'delivery' ? formData.address.trim() : '',
      customerName,
      customerPhone: formData.phone.trim(),
      items: items.map((item) => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        spiceLevel: item.spiceLevel,
        specialInstructions: item.specialInstructions,
        addons: item.addons || [],
      })),
      total,
      channel: 'Website demo',
    });

    setOrderId(createdOrderId);
    setCompletedCustomerName(customerName);
    clearCart();
    setFormData(EMPTY_FORM);
    setIsOpen(false);
    setShowConfirmation(true);
    setStep('cart');
  };

  const incrementQuantity = (item, delta) => {
    if (delta < 0 && item.quantity === 1) {
      removeItem(item.dishId, item.spiceLevel);
      return;
    }
    updateQuantity(item.dishId, item.spiceLevel, delta);
  };

  const whatsappUrl = orderId
    ? `https://wa.me/${brandData.contact.whatsapp}?text=${encodeURIComponent(`New demo order ${orderId} from ${completedCustomerName}. Please confirm with the restaurant team.`)}`
    : '';

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && !isOpen && !isStaffPage && !showConfirmation && (
          <motion.button
            type="button"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 left-4 right-4 z-50 mx-auto flex max-w-2xl items-center justify-between rounded-2xl bg-amber-500 px-5 py-4 font-bold text-neutral-950 shadow-2xl shadow-amber-500/25"
            aria-label={`Open cart with ${totalItems} items, total ${format(total)}`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              <span>{totalItems} {totalItems === 1 ? 'item' : 'items'} · View cart</span>
            </span>
            <span>{format(total)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[60] cursor-default bg-black/60 backdrop-blur-sm"
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-pipeline-title"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed inset-x-0 bottom-0 z-[70] mx-auto flex max-h-[92dvh] w-full max-w-3xl flex-col rounded-t-3xl border p-4 shadow-2xl sm:p-6 ${
                isDark ? 'border-neutral-800 bg-neutral-950 text-white' : 'border-stone-200 bg-white text-stone-900'
              }`}
            >
              <div className="relative mb-4 flex items-center justify-between border-b border-current/10 pb-4">
                <div className={`absolute -top-1 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-stone-300'}`} />
                <div>
                  <h2 id="cart-pipeline-title" className="pt-2 text-lg font-black uppercase tracking-tight">
                    {step === 'checkout' ? 'Checkout' : 'Your order'}
                  </h2>
                  {step === 'cart' && (
                    <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
                      {tableId ? `Table ${tableId} selected` : 'Choose how you want your order'}
                    </p>
                  )}
                </div>
                <button type="button" onClick={close} className="rounded-full p-2 hover:bg-current/10" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pb-4">
                {step === 'cart' && (
                  <div className="space-y-4">
                    {items.length === 0 ? (
                      <div className="py-8 text-center">
                        <p>Your cart is empty.</p>
                        <Link to="/menu" onClick={close} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-neutral-950">
                          Browse menu <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
                          <button
                            type="button"
                            onClick={() => setConfirmEmptyCart(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" /> Empty cart
                          </button>
                        </div>
                        {confirmEmptyCart && (
                          <div role="alertdialog" aria-label="Confirm empty cart" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                            <p className="text-sm font-semibold">Remove every item from your cart?</p>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setConfirmEmptyCart(false)} className="rounded-lg px-3 py-2 text-xs font-bold hover:bg-current/10">Keep items</button>
                              <button
                                type="button"
                                onClick={() => {
                                  emptyCart();
                                  setConfirmEmptyCart(false);
                                  setError('');
                                }}
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                              >
                                Empty cart
                              </button>
                            </div>
                          </div>
                        )}
                        {items.map((item, index) => (
                      <article key={`${item.dishId}-${item.spiceLevel}-${index}`} className={`flex gap-3 rounded-xl border p-3 ${isDark ? 'border-neutral-800 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}>
                        {item.image && <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" />}
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold">{item.name}</h3>
                              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
                                {item.spiceLevel || 'Standard'} · {format(item.price)} each
                              </p>
                            </div>
                            <span className="text-sm font-bold text-amber-500">
                              {format((item.price + (item.addons || []).reduce((sum, addon) => sum + addon.price * addon.quantity, 0)) * item.quantity)}
                            </span>
                          </div>
                          {item.specialInstructions && <p className="mt-1 text-xs italic opacity-70">{item.specialInstructions}</p>}
                          <div className="mt-2 flex items-center justify-between">
                            <div className={`flex items-center gap-3 rounded-lg p-1 ${isDark ? 'bg-neutral-800' : 'bg-stone-200'}`}>
                              <button type="button" onClick={() => incrementQuantity(item, -1)} className="rounded p-1" aria-label={`Decrease ${item.name} quantity`}>
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-4 text-center text-sm font-bold">{item.quantity}</span>
                              <button type="button" onClick={() => incrementQuantity(item, 1)} className="rounded p-1" aria-label={`Increase ${item.name} quantity`}>
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            {!!item.addons?.length && (
                              <span className="text-xs opacity-70">Includes {item.addons.map((addon) => addon.name).join(', ')}</span>
                            )}
                          </div>
                        </div>
                      </article>
                        ))}
                      </>
                    )}
                    {items.length > 0 && (
                      <>
                        <div className="border-t border-current/10 pt-4">
                          <p className="mb-3 text-sm font-bold">How would you like your order?</p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {FULFILLMENT_OPTIONS.map((option) => {
                              const Icon = option.icon;
                              return (
                                <button
                                  type="button"
                                  key={option.id}
                                  onClick={() => setFulfillment(option.id)}
                                  aria-pressed={fulfillment === option.id}
                                  className={`rounded-xl border p-3 text-left transition ${fulfillment === option.id ? 'border-amber-500 bg-amber-500/10' : isDark ? 'border-neutral-800 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}
                                >
                                  <Icon className={`mb-2 h-5 w-5 ${fulfillment === option.id ? 'text-amber-500' : 'opacity-60'}`} />
                                  <span className="block text-sm font-bold">{option.label}</span>
                                  <span className="mt-1 block text-[11px] opacity-65">{option.detail}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {fulfillment === 'dine-in' && (
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold">Table number</span>
                            <span className="relative block">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 opacity-50" />
                              <input
                                required
                                value={tableId || ''}
                                onChange={(event) => setTableId(event.target.value)}
                                className={`w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none focus:border-amber-500 ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}
                                placeholder="Enter table number"
                              />
                            </span>
                          </label>
                        )}
                        <div className="flex items-center justify-between border-t border-current/10 pt-4 font-bold">
                          <span>Subtotal</span><span>{format(total)}</span>
                        </div>
                        <button type="button" onClick={() => setStep('checkout')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 font-bold text-neutral-950 hover:bg-amber-400">
                          Continue to checkout <ArrowRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {step === 'checkout' && (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className={`flex items-center gap-3 rounded-xl border p-3 ${isDark ? 'border-amber-500/20 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                      <MapPin className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide">Fulfillment</p>
                        <p className="text-sm">
                          {fulfillment === 'dine-in' ? `Dine in · Table ${tableId || 'not selected'}` : fulfillment === 'delivery' ? 'Delivery' : 'Takeaway'}
                        </p>
                      </div>
                    </div>
                    {fulfillment === 'delivery' && (
                      <label className="block">
                        <span className="mb-1 block text-xs font-semibold">Delivery address</span>
                        <textarea
                          required
                          rows={2}
                          autoComplete="street-address"
                          value={formData.address}
                          onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                          className={`w-full resize-y rounded-xl border px-3 py-3 text-sm outline-none focus:border-amber-500 ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}
                          placeholder="Building, street, area and delivery directions"
                        />
                      </label>
                    )}
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold">Your name</span>
                      <span className="relative block">
                        <User className="absolute left-3 top-3 h-4 w-4 opacity-50" />
                        <input
                          required
                          autoComplete="name"
                          value={formData.name}
                          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                          className={`w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none focus:border-amber-500 ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}
                          placeholder="Full name"
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold">Phone number</span>
                      <input
                        required
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                        className={`w-full rounded-xl border px-3 py-3 text-sm outline-none focus:border-amber-500 ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}
                        placeholder="+254 7XX XXX XXX"
                      />
                    </label>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${isDark ? 'border-neutral-800 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}>
                      <input
                        type="checkbox"
                        checked={rememberDetails}
                        onChange={(event) => setRememberDetails(event.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-amber-500"
                      />
                      <span>
                        <span className="block font-bold">Remember my details on this device</span>
                        <span className="mt-1 block text-xs opacity-70">Saved in this browser for faster checkout. Other people using this device may be able to access these details; this is not account verification.</span>
                      </span>
                    </label>
                    {hasSavedDetails && (
                      <button type="button" onClick={forgetSavedDetails} className="text-xs font-semibold text-red-600 underline underline-offset-2 dark:text-red-400">
                        Forget saved details on this device
                      </button>
                    )}
                    <div className={`rounded-xl border p-3 text-sm ${isDark ? 'border-neutral-800 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}>
                      <div className="mb-2 flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Digital order & receipt</div>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
                        Your order will be saved in this browser demo and appear on the staff board in this same session. No live restaurant order or payment is sent.
                      </p>
                    </div>
                    <div className="flex justify-between border-t border-current/10 pt-4 font-black">
                      <span>Total</span><span>{format(total)}</span>
                    </div>
                    {fulfillment === 'delivery' && (
                      <p className="text-xs text-stone-500 dark:text-neutral-400">Delivery fees are not configured in this demo.</p>
                    )}
                    {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
                    <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white hover:bg-green-500">
                      Place demo order <Check className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => { setStep('cart'); setError(''); }} className="w-full py-2 text-sm opacity-70 hover:opacity-100">
                      Back to order
                    </button>
                  </form>
                )}
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirmation-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-emerald-600 px-5 py-10 text-white"
          >
            <motion.div
              initial={{ scale: 0.65, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.1 }}
              className="mx-auto flex w-full max-w-md flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 230, damping: 14, delay: 0.2 }}
                className="mb-7 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/70 bg-white text-emerald-600 shadow-2xl"
              >
                <Check className="h-16 w-16 stroke-[3]" />
              </motion.div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100">Demo order created</p>
              <h2 id="order-confirmation-title" className="mt-3 text-3xl font-black">Order received!</h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50">
                {orderId} is saved for this browser session. This demo does not send a live order to the restaurant.
              </p>
              <Link
                to={`/receipt/${orderId}`}
                onClick={() => setShowConfirmation(false)}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-4 font-black text-emerald-700 shadow-lg transition hover:bg-emerald-50"
              >
                View digital receipt <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/50 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5" /> Contact restaurant on WhatsApp
              </a>
              <button type="button" onClick={() => setShowConfirmation(false)} className="mt-5 text-sm font-semibold text-emerald-100 underline underline-offset-4">
                Continue browsing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
