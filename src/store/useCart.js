import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,
      flashCart: false,
      
      addItem: (item) => {
        set({ flashCart: true });
        setTimeout(() => set({ flashCart: false }), 600); // Trigger flash animation
        
        set((state) => {
          const existing = state.items.find(i => i.dishId === item.dishId && i.spiceLevel === item.spiceLevel);
          if (existing) {
            return { items: state.items.map(i => i.dishId === item.dishId && i.spiceLevel === item.spiceLevel ? { ...i, quantity: i.quantity + item.quantity } : i) };
          }
          return { items: [...state.items, item] };
        });
      },
      
      addAddon: (mainDishId, addonItem) => {
        set((state) => {
          const updatedItems = state.items.map(item => {
            if (item.dishId === mainDishId) {
              const existingAddon = item.addons?.find(a => a.dishId === addonItem.dishId);
              if (existingAddon) {
                return {
                  ...item,
                  addons: item.addons.map(a => a.dishId === addonItem.dishId ? { ...a, quantity: a.quantity + 1 } : a)
                };
              }
              return { ...item, addons: [...(item.addons || []), { ...addonItem, quantity: 1 }] };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },

      removeItem: (dishId, spiceLevel) => set((state) => ({
        items: state.items.filter(i => !(i.dishId === dishId && i.spiceLevel === spiceLevel)),
      })),

      updateQuantity: (dishId, spiceLevel, delta) => set((state) => ({
        items: state.items.map(i => {
          if (i.dishId === dishId && i.spiceLevel === spiceLevel) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : i;
          }
          return i;
        }).filter(i => i.quantity > 0),
      })),

      clearCart: () => set({ items: [], tableId: null }),
      setTableId: (id) => set({ tableId: id }),
      getTotal: () => get().items.reduce((sum, item) => {
        const addonsTotal = item.addons ? item.addons.reduce((aSum, addon) => aSum + (addon.price * addon.quantity), 0) : 0;
        return sum + ((item.price + addonsTotal) * item.quantity);
      }, 0),
    }),
    { name: 'savanna-cart-storage' }
  )
);
