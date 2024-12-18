// client/app/store/useDRIStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DRIState {
    calories: number | null;
    protein: number | null;
    allergies: string[];
    setDRI: (calories: number, protein: number, allergies?: string[]) => void;
    clearDRI: () => void;
}

const useDRIStore = create<DRIState>()(
    persist(
        (set) => ({
            calories: null,
            protein: null,
            allergies: [],
            setDRI: (calories: number, protein: number, allergies: string[] = []) => set({ calories, protein, allergies }),
            clearDRI: () => set({ calories: null, protein: null, allergies: [] }),
        }),
        {
            name: "dri-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useDRIStore;