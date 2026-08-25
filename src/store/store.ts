import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { createAuthSlice } from "./auth.slice";
import type { Store } from "@/types/store.type";

export const useStore = create<Store>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((...a) => ({
                    ...createAuthSlice(...a),
                }))
            ),
            {
                name: "auth-storage",
                partialize: (state) => ({
                    user: state.user
                })
            }
        )
    )
)