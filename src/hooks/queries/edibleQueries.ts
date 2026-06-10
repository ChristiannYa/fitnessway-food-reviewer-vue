import { apiClientAppKt } from "@/api/apiClient"
import { pagination } from "@/constants/pagination"
import { queryKeys } from "@/constants/queryKeys"
import type { PendingFoodsByUserIdRes, PendingFoodsReqParams } from "@/types/foodTypes"
import { queryOptions, useQuery as useTanstackQuery  } from "@tanstack/vue-query"

export function getPendingEdiblesByUserIdQuery() {

	const getOptions = (params: PendingFoodsReqParams) => queryOptions({
		queryKey: queryKeys.food.pending.byUserId(params),
		queryFn: async () => {
			await new Promise(resolve => setTimeout(resolve, 150));

			return apiClientAppKt.req<PendingFoodsByUserIdRes>({
				method: "GET",
				path: "/edible/pending/find-by/user-id",
				params: {
					limit: `${pagination.limit}`,
					offset: `${params.offset}`,
					userId: params.userId ?? "",
					...(params.status && {
						pendingStatus: params.status
					})
				}
			});
		}
	});

	const useQuery = (
		params: PendingFoodsReqParams,
		extraOptions?: Partial<NonNullable<ReturnType<typeof getOptions>>>
	) => useTanstackQuery({
		...getOptions(params),
		...extraOptions
	});

	return { getOptions, useQuery };
};
