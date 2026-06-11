import type { NutrientDataAmount } from "@/types/nutrientTypes";
import type { NutrientSchema } from "@/schemas/NutrientSchema";
import { computed, type MaybeRefOrGetter, toValue } from "vue";

export const useNutrientSchemaFromList = (
	list: MaybeRefOrGetter<NutrientDataAmount[] | undefined>
) => computed((): NutrientSchema | undefined => {
	
	const nutrients = toValue(list);
	if (!nutrients) return undefined;

	return Object.fromEntries(
		nutrients.map(n => [String(n.data.base.id), n.amount])
	);
});