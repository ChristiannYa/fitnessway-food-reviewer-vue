import { apiClientAppKt } from "@/api/apiClient";
import type { UserRes } from "@/types/userTypes";
import { queryOptions, useQuery as useTanstackQuery } from "@tanstack/vue-query";

export const useUserQuery = () => useTanstackQuery({
    queryKey: ["user"],
    queryFn: () => apiClientAppKt.req<UserRes>({
        method:"GET",
        path: "/user"
    })
});

export function getUserQuery() {

	const queryFn = () => 
		apiClientAppKt.req<UserRes>({
			method: 'GET',
			path: "/user",
		})

	const getOptions = () => queryOptions({
		queryKey: ["user"],
		queryFn: queryFn
	});

	const useQuery = (
		extraOptions?: Partial<NonNullable<ReturnType<typeof getOptions>>>
	) => useTanstackQuery({
		...getOptions(),
		...extraOptions
	});

	return { queryFn, getOptions, useQuery };
};
