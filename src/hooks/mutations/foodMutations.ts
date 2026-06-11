import { apiClientAppKt } from "@/api/apiClient"
import type { 
	AppEdibleWriteReq, 
	ApPedibleSubmitRes, 
	PendingFoodReviewReq, 
	PendingFoodReviewRes 
} from "@/types/foodTypes"
import { useMutation } from "@tanstack/vue-query"

export const useReviewMutation = () => useMutation({
	mutationFn: (req: PendingFoodReviewReq) => 
		apiClientAppKt.req<PendingFoodReviewRes>({
			method: "POST",
			path: "/edible/pending/review",
			body: req
		})
});

export const useSubmitMutation = () => useMutation({
	mutationFn: (req: AppEdibleWriteReq) =>
		apiClientAppKt.req<ApPedibleSubmitRes>({
			method: "POST",
			path: "/edible/app",
			body: req
		})
});

export const useUpdateMutation = () => useMutation({
	mutationFn: (req: AppEdibleWriteReq) =>
		apiClientAppKt.req<never>({
			method: "PUT",
			path: "edible/app",
			body: req
		})
});
