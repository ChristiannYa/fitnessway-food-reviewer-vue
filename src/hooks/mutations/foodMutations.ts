import { apiClientApp } from "@/api/apiClient"
import type { PendingFoodReviewReq, PendingFoodReviewRes } from "@/types/foodTypes"
import { useMutation } from "@tanstack/vue-query"

export const useReviewMutation = () => {
    return useMutation({
        mutationFn: (req: PendingFoodReviewReq) => 
            apiClientApp.req<PendingFoodReviewRes>({
                method: "POST",
                path: "/food/pending/review",
                body: req
            })
    })
}