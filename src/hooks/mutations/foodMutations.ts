import { apiClientAppKt } from "@/api/apiClient"
import { queryKeys } from "@/constants/queryKeys";
import type { 
	AppEdibleWriteReq, 
	ApPedibleSubmitRes, 
	PendingFoodReviewReq, 
	PendingFoodReviewRes 
} from "@/types/foodTypes"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { useAdminSubmissionsState } from "../composables/useAdminSubmissionsState";

export const useReviewMutation = () => useMutation({
	mutationFn: (req: PendingFoodReviewReq) => 
		apiClientAppKt.req<PendingFoodReviewRes>({
			method: "POST",
			path: "/edible/pending/review",
			body: req
		})
});

export const useSubmitMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (req: AppEdibleWriteReq) =>
		apiClientAppKt.req<ApPedibleSubmitRes>({
			method: "POST",
			path: "/edible/app",
			body: req
		}),
		onSuccess: () => {
			queryClient.resetQueries({ 
				queryKey: queryKeys.edible.app.adminSubmissionsAll() 
			});
			useAdminSubmissionsState().reset();
		}
	})
};

export const useUpdateMutation = (id: string) => useMutation({
	mutationFn: (req: AppEdibleWriteReq) =>
		apiClientAppKt.req<never>({
			method: "PUT",
			path: "/edible/app",
			body: req,
			params: { edibleId: id }
		})
});
