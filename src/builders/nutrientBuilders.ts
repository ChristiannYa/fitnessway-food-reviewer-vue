import type { NutrientGroupable, NutrientsByType, NutrientType } from "@/types/nutrientTypes";

export const buildNutrientListTyped = <T extends NutrientGroupable>(
	nutrientsByType: NutrientsByType<T>
): { type: NutrientType; nutrients: T[] }[] => ([
	{ type: "BASIC", nutrients: nutrientsByType.basic },
	{ type: "VITAMIN", nutrients: nutrientsByType.vitamin },
	{ type: "MINERAL", nutrients: nutrientsByType.mineral }
]);