import type { AdminEdibleSubmissionsReqParams, AppEdibleReportsReqParams, PendingFoodsReqParams } from "@/types/foodTypes";

export const queryKeys = {
    user: {
        all: () => ["user"] as const,
		
        me: () =>  ["user", "me"] as const
    },
    edible: {
		app: {
			all: () =>                                                 ["edible", "app"] as const,

			byId: (id: number) =>                                      ["edible", "app", "byId", id] as const,
			byBarcode: (barcode: string) => 						   ["edble", "app", "byBarcode", barcode] as const,

			adminSubmissionsAll: () =>                                 ["edible", "app", "adminSubmissions"] as const,
			adminsSubmissions: (p: AdminEdibleSubmissionsReqParams) => [...queryKeys.edible.app.adminSubmissionsAll(), p] as const,

            reportsAll: () =>                                          ["edible", "app", "reports"] as const,
            reports: (req: AppEdibleReportsReqParams) =>               [...queryKeys.edible.app.reportsAll(), req] as const
		},
        pending: {
            all: () => 									   ["edible", "pending"] as const,

            byUserIdAll: () => 							   ["edible", "pending", "byUserId"] as const,
            byUserId: (params: PendingFoodsReqParams) =>   [...queryKeys.edible.pending.byUserIdAll(), params] as const,

            byUserTypeAll: () =>                           ["edible", "pending", "byUserType"] as const,
            byUserType: (params: PendingFoodsReqParams) => [...queryKeys.edible.pending.byUserTypeAll(), params] as const
        }
    }
};
