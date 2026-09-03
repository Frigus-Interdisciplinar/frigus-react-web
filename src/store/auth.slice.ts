import type { Store } from "@/types/store.type";
import { type StateCreator } from "zustand"

type AccountType = "DOMESTIC" | "COMMERCIAL" | "BUSINESS";

interface AuthUser {
    id: string;
    name: string;
    email: string;
    birthDate: string;
    accountType: AccountType;
}

interface AuthActions {
    login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export type AuthSlice = AuthState & AuthActions


export const createAuthSlice: StateCreator<Store, [["zustand/immer", never]], [], AuthSlice> = (set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,

    login: (user, accessToken, refreshToken) => {
        set((state) => ({
            ...state,
            user,
            accessToken,
            refreshToken,
        }))
    },
    logout: () => {
        set((state) => ({
            ...state,
            user: null,
            accessToken: null,
            refreshToken: null,
        }))
    },
})