import { apiClientAppKt } from "@/api/apiClient"
import { pagination } from "@/constants/pagination"
import { queryKeys } from "@/constants/queryKeys"
import type { AdminEdibleSubmissionsReqParams, AdminEdibleSubmissionsRes, PendingFoodsByUserIdRes, PendingFoodsReqParams } from "@/types/foodTypes"
import { queryOptions, useQuery as useTanstackQuery  } from "@tanstack/vue-query"

async function withQueryDelay<T>(fn: () => Promise<T>): Promise<T> {
	await new Promise(resolve => setTimeout(resolve, 2000));
	return fn();
};

export function getPendingEdiblesByUserIdQuery() {

	const getOptions = (params: PendingFoodsReqParams) => queryOptions({
		queryKey: queryKeys.edible.pending.byUserId(params),
		queryFn: () => withQueryDelay(() => apiClientAppKt.req<PendingFoodsByUserIdRes>({
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
		}))
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

export function getAdminSubmissionsQuery() {

	const getOptions = ({ offset, date }: AdminEdibleSubmissionsReqParams) => queryOptions({
		queryKey: queryKeys.edible.app.adminsSubmissions({ offset, date }),
		queryFn: () => withQueryDelay(() => apiClientAppKt.req<AdminEdibleSubmissionsRes>({
			method: "GET",
			path: "/edible/app/admin-submissions",
			params: {
				limit: `${pagination.limit}`,
				offset: `${offset}`,
				...(date && { createdAt: date })
			}
		}))
	});

	const useQuery = (
		params: AdminEdibleSubmissionsReqParams,
		extraOptions?: Partial<NonNullable<ReturnType<typeof getOptions>>>
	) => useTanstackQuery({
		...getOptions(params),
		...extraOptions
	});

	return { getOptions, useQuery }
};
