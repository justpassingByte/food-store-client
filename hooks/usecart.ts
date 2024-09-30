import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Products } from '@/type-db';
import { toast } from 'react-hot-toast';

interface CartStore {
  items: Products[];
  addItem: (data: Products) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
}

const useCarts = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Products) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);
        if (existingItem) {
          toast("Item already in cart");
          return; 
        }
        set({ items: [...currentItems, { ...data, qty: 1 }] }); // Set qty to 1
        toast.success("Item added to cart");
      },
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Item removed from cart");
      },
      removeAll: () => {
        set({ items: [] });
        toast.success("All items removed from cart");
      },
      updateQuantity: (id: string, qty: number) => { // Change here
        const updatedItems = get().items.map((item) =>
          item.id === id ? { ...item, qty } : item // Use qty
        );
        set({ items: updatedItems });
        toast.success("Quantity updated");
      },
      increaseQuantity: (id: string) => {
        set((state) => {
          const item = state.items.find((item) => item.id === id);
          if (item) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item // Use qty
              ),
            };
          }
        });
        toast.success("Quantity increased");
      },
      decreaseQuantity: (id: string) => {
        set((state) => {
          const item = state.items.find((item) => item.id === id);
          if (item && item.qty > 1) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, qty: item.qty - 1 } : item // Use qty
              ),
            };
          } else {
            toast.error("Quantity cannot be less than 1");
            return { items: state.items };
          }
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);


export default useCarts;
