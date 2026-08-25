import { create } from 'zustand';

export const useUserStore = create((set, get) => ({
  phoneNumber: '',
  loyaltyStamps: 0,
  orders: [],

  setPhoneNumber: (num) => set({ phoneNumber: num }),
  addStamp: () => set((state) => ({ loyaltyStamps: Math.min(10, state.loyaltyStamps + 1) })),
  recordOrder: (amount) => set((state) => ({ orders: [...state.orders, { amount, time: new Date().toISOString() }] })),
}));
