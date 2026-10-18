import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { createAuthSlice } from "./auth.slice";
import type { Store } from "@/types/store.type";

export const useStore = create<Store>()(
    devtools(
        subscribeWithSelector(
            immer((...a) => ({
                ...createAuthSlice(...a),
            }))
        )
    )
)

if (typeof window !== "undefined") {
    try {
        window.localStorage.removeItem("auth-storage");
    } catch {
        // Storage may be disabled by the browser; auth state remains in memory.
    }
}
