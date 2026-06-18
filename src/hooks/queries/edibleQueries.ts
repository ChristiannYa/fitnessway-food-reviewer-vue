import { apiClientAppKt } from "@/api/apiClient"
import { pagination } from "@/constants/pagination"
import { queryKeys } from "@/constants/queryKeys"
import type { AdminEdibleSubmissionsReqParams, AdminEdibleSubmissionsRes, AppEdibleByBarcodeRes, AppEdibleByIdRes, PendingFoodsByUserIdRes, PendingFoodsReqParams } from "@/types/foodTypes"
import { withDelay } from "@/utils/appUtils"
import { queryOptions, useQuery as useTanstackQuery  } from "@tanstack/vue-query"

export function getPendingEdiblesByUserIdQuery() {

	const getOptions = (params: PendingFoodsReqParams) => queryOptions({
		queryKey: queryKeys.edible.pending.byUserId(params),
		queryFn: () => withDelay(() => apiClientAppKt.req<PendingFoodsByUserIdRes>({
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

export function getAppEdibleByIdQuery() {

	const getOptions = (id: number) =>
		queryOptions({
			queryKey: queryKeys.edible.app.byId(id),
			queryFn: () => withDelay(() => 
				apiClientAppKt.req<AppEdibleByIdRes>({
					method: "GET",
					path: `/edible/app/${id}`
				})
			)
		});

		const useQuery = (
			id: number,
			extraOptions?: Partial<NonNullable<ReturnType<typeof getOptions>>>
		) => useTanstackQuery({
			...getOptions(id),
			...extraOptions
		});

		return { getOptions, useQuery };
};

export function getAppEdibleByBarcodeQuery() {

	const getOptions = (barcode: string) =>
		queryOptions({
			queryKey: queryKeys.edible.app.byBarcode(barcode),
			queryFn: () => withDelay(() => 
				apiClientAppKt.req<AppEdibleByBarcodeRes>({
					method: "GET",
					path: `/edible/app/barcode/${barcode}`
				}),
				1000
			)
		});

		const useQuery = (
			barcode: string,
			extraOptions?: Partial<NonNullable<ReturnType<typeof getOptions>>>
		) => useTanstackQuery({
			...getOptions(barcode),
			...extraOptions
		});

		return { getOptions, useQuery };
};

export function getAdminSubmissionsQuery() {

	const getOptions = ({ offset, date }: AdminEdibleSubmissionsReqParams) => queryOptions({
		queryKey: queryKeys.edible.app.adminsSubmissions({ offset, date }),
		queryFn: () => withDelay(() => apiClientAppKt.req<AdminEdibleSubmissionsRes>({
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
