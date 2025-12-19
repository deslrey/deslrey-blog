import { create } from 'zustand'

interface NavState {
    title: string;
    setTitle: (title: string) => void;
    clearTitle: () => void;
}

const useNavStore = create<NavState>((set) => ({
    title: "",
    setTitle: (title) => set({ title }),
    clearTitle: () => set({ title: "" })
}))

export default useNavStore