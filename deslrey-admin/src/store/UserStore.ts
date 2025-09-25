import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../interfaces";

type UserState = {
    user: User;
    setUser: (user: User) => void;
    clearUser: () => void;
    update: (user: Partial<User>) => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: { token: null, userName: null, email: null, avatar: null },
            setUser: (user) => set({ user }),
            clearUser: () =>
                set({ user: { token: null, userName: null, email: null, avatar: null } }),
            update: (user) =>
                set((state) => ({
                    user: { ...state.user, ...user },
                })),
        }),
        {
            name: "userInfo",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
