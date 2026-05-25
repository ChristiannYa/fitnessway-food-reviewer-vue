import { apiClientAppGo } from "@/api/apiClient";
import type { NutrientsRes } from "@/types/nutrientTypes";
import { useQuery } from "@tanstack/vue-query";

export const useNutrientsByTypeQuery = () => useQuery({
	queryKey: ["nutrientsByType"],
	queryFn: () => apiClientAppGo.req<NutrientsRes>({
		method: "GET",
		path: "/nutrient/get-nutrients"
	})
})