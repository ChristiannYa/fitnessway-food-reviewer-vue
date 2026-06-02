import type { NutrientGroupable, NutrientsByType, NutrientType } from "@/types/nutrientTypes";

export const buildNutrientListTyped = <T extends NutrientGroupable>(
	nutrientsByType: NutrientsByType<T>
): { type: NutrientType; nutrients: T[] }[] => ([
	{ type: "BASIC", nutrients: nutrientsByType.basic },
	{ type: "VITAMIN", nutrients: nutrientsByType.vitamin },
	{ type: "MINERAL", nutrients: nutrientsByType.mineral }
]);

export const buildNutrientListsByType = <T extends NutrientGroupable>(
	nutrients: NutrientsByType<T>,
	type: NutrientType
): T[] => {
	switch(type) {
		case "BASIC": return nutrients.basic;
		case "VITAMIN": return nutrients.vitamin;
		case "MINERAL": return nutrients.mineral;
	}
};