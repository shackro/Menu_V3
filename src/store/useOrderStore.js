import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const STATUS_ORDER = ['pending', 'preparing', 'ready', 'served'];

export const useOrderStore = create(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) => {
        const createdOrder = {
          ...order,
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          createdAt: Date.now(),
          servedAt: null,
          status: 'pending',
          paymentStatus: 'unpaid',
          paymentMethod: null,
        };
        set((state) => ({ orders: [createdOrder, ...state.orders] }));
        return createdOrder.id;
      },

      updateStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId && STATUS_ORDER.includes(status)
            ? {
                ...order,
                status,
                servedAt: status === 'served' ? (order.servedAt || Date.now()) : order.servedAt,
              }
            : order
        ),
      })),

      updatePayment: (orderId, paymentStatus, paymentMethod) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId && ['unpaid', 'requested', 'awaiting_confirmation', 'paid'].includes(paymentStatus)
            ? {
                ...order,
                paymentStatus,
                paymentMethod,
                paidAt: paymentStatus === 'paid' ? Date.now() : order.paidAt,
              }
            : order
        ),
      })),
    }),
    {
      name: 'savanna-session-orders',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
