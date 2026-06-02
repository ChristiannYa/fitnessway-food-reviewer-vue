import { apiClientAppKt } from "@/api/apiClient";
import type { NutrientsRes } from "@/types/nutrientTypes";
import { useQuery } from "@tanstack/vue-query";

export const useNutrientsByTypeQuery = () => useQuery({
	queryKey: ["nutrientsByType"],
	queryFn: () => apiClientAppKt.req<NutrientsRes>({
		method: "GET",
		path: "/nutrient/all-by-type"
	})
})