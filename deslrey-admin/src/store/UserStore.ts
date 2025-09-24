import { create } from "zustand";

type User = {
    token: string | null;
    username: string | null;
    email: string | null;
    avatar: string | null;
};

type UserState = {
    user: User;
    setUser: (user: User) => void;
    clearUser: () => void;
};

const getInitialUser = (): User => {
    const stored = sessionStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : { token: null, username: null, email: null, avatar: null };
};

export const useUserStore = create<UserState>((set) => ({
    user: getInitialUser(),
    setUser: (user) => {
        sessionStorage.setItem("userInfo", JSON.stringify(user));
        set({ user });
    },
    clearUser: () => {
        sessionStorage.removeItem("userInfo");
        set({
            user: { token: null, username: null, email: null, avatar: null },
        });
    },
}));
