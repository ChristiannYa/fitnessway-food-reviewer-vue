import type { PendingFoodsReqParams } from "@/types/foodTypes";

export const queryKeys = {
    user: {
        all: () => ["user"] as const,

        me: () => ["user", "me"] as const
    },
    food: {
        pending: {
            all: () => ["food", "pending"] as const,

            byUserIdAll: () => ["food", "pending", "byUserId"],

            byUserId: (params: PendingFoodsReqParams) => 
                [...queryKeys.food.pending.byUserIdAll(), params] as const,

            byUserTypeAll: () => ["food", "pending", "byUserType"],
            
            byUserType: (params: PendingFoodsReqParams) => 
                [...queryKeys.food.pending.byUserTypeAll(), params] as const
        }
    }
}