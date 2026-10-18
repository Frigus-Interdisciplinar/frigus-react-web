import type { Store } from "@/types/store.type";
import { type StateCreator } from "zustand"
import type { AuthUser } from "@/types/auth.type";

interface AuthActions {
    login: (user: AuthUser) => void;
    logout: () => void;
    setInitialized: (initialized: boolean) => void;
}

interface AuthState {
    user: AuthUser | null;
    initialized: boolean;
}

export type AuthSlice = AuthState & AuthActions


export const createAuthSlice: StateCreator<Store, [["zustand/immer", never]], [], AuthSlice> = (set) => ({
    user: null,
    initialized: false,

    login: (user) => {
        set((state) => ({
            ...state,
            user,
        }))
    },
    logout: () => {
        set((state) => ({
            ...state,
            user: null,
        }))
    },
    setInitialized: (initialized) => {
        set((state) => ({ ...state, initialized }))
    },
})
