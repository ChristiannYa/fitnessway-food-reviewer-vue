import { apiClientAppKt } from "@/api/apiClient"
import { queryKeys } from "@/constants/queryKeys";
import type { 
	AppEdibleWriteReq, 
	ApPedibleSubmitRes, 
	PendingFoodReviewReq, 
	PendingFoodReviewRes,
	AppEdibleData,
	AdminEdibleSubmissionsRes,
} from "@/types/foodTypes"
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/vue-query"
import { useAdminSubmissionsState } from "../composables/useAdminSubmissionsState";
import { buildNutrientList, buildNutrientsByTypeFromList } from "@/builders/nutrientBuilders";
import { getNutrientDataAmountsFromIds } from "@/utils/nutrientUtils";
import { getAdminSubmissionsQuery } from "../queries/edibleQueries";
import { produce } from "immer";
import { useNutrientsByTypeQuery } from "../queries/nutrientQueries";
import { toRaw } from "vue";
import type { ClientResponse } from "@/builders/clientResponseBuilders";

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

export const useUpdateMutation = (id: string) => {
	type MutateCtx = { 
		originalAcc: AppEdibleData,
		originalAdminSubmissionsQc: ClientResponse<AdminEdibleSubmissionsRes> | undefined,
		adminSubmissionsQk: QueryKey
	 } | undefined;

	const queryClient = useQueryClient();
	const { data: nutrientsByTypeRes } = useNutrientsByTypeQuery();
	const { accumulatedSubmissions, offset } = useAdminSubmissionsState();

	function onRollback(ctx: MutateCtx) {
		if (!ctx) return;

		accumulatedSubmissions.value = accumulatedSubmissions.value
			.map(s => s.edible.id === Number(id) ? ctx.originalAcc : s);

		queryClient.setQueryData(ctx.adminSubmissionsQk, ctx.originalAdminSubmissionsQc);
	};

	return useMutation({
		mutationFn: (req: AppEdibleWriteReq) => 
			apiClientAppKt.req<never>({
				method: "PUT",
				path: "/edible/app/foo",
				body: req,
				params: { edibleId: id }
			}),
		onMutate: (req): MutateCtx => {
			const nutrientsByType = (() => {
				const nutrientsApi = nutrientsByTypeRes?.value?.data?.nutrientsByType;
				if (!nutrientsApi) return;

				const amountList = getNutrientDataAmountsFromIds(
					req.edibleRequest.nutrients,
					buildNutrientList(toRaw(nutrientsApi)),
				)

				return buildNutrientsByTypeFromList(amountList, (n) => n.data.base.type);
			})();
			if (!nutrientsByType) return;

			const originalAcc = accumulatedSubmissions.value.find(s => s.edible.id === Number(id));
			if (!originalAcc) return;

			const optimistic = produce(originalAcc, (draft) => {
				draft.edible.information = {
					base: req.edibleRequest.base,
					nutrients: nutrientsByType,
					type: req.edibleRequest.edibleType
				}

				draft.barcode = req.barcode
			});

			const adminSubmissionsQk = getAdminSubmissionsQuery().getOptions({ offset: offset.value }).queryKey;
			const originalAdminSubmissionsQc = queryClient.getQueryData(adminSubmissionsQk)

			queryClient.setQueryData(adminSubmissionsQk, (original) => {
				if (!original?.data) return original;
				return produce(original, draft => {
					draft.data.submittedAppEdibles.data = draft.data.submittedAppEdibles.data
						.map(s => s.edible.id === Number(id) ? optimistic : s);
				});
			});

			accumulatedSubmissions.value = accumulatedSubmissions.value
				.map(s => s.edible.id === Number(id) ? optimistic : s);

			return { originalAcc, originalAdminSubmissionsQc: originalAdminSubmissionsQc, adminSubmissionsQk };
		},
		onSuccess: (res, _, ctx) => { if (!res.success) onRollback(ctx) },
		onError: (_, __, ctx) => onRollback(ctx)
	});
};
