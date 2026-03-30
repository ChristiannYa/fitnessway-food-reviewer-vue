import { apiClientApp } from "@/api/apiClient"
import { pagination } from "@/constants/pagination"
import { queryKeys } from "@/constants/queryKeys"
import type { PendingFoodsByUserIdRes, PendingFoodsReqParams } from "@/types/foodTypes"
import { queryOptions, useQuery,  } from "@tanstack/vue-query"

export const getPendingFoodByUserIdQueryOptions = (params: PendingFoodsReqParams) => queryOptions({
    queryKey: queryKeys.food.pending.byUserId(params),
    queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 150));

        return apiClientApp.req<PendingFoodsByUserIdRes>({
            method: "GET",
            path: "/food/pending/find-by/user-id",
            params: {
                limit: `${pagination.limit}`,
                offset: `${params.offset}`,
                userId: params.userId ?? "",
                ...(params.status && {
                    pendingStatus: params.status
                })
            }
        })
    }
})

export const usePendingFoodsByUserIdQuery = (
    params: PendingFoodsReqParams,
    extraOptions?: Partial<NonNullable<ReturnType<typeof getPendingFoodByUserIdQueryOptions>>>
) => useQuery({
    ...getPendingFoodByUserIdQueryOptions(params),
    ...extraOptions
})