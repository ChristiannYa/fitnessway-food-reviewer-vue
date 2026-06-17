import type { 
	NutrientGroupable, 
	NutrientsByType, 
	NutrientType 
} from "@/types/nutrientTypes";

export const buildNutrientList = <T extends NutrientGroupable> (
	nutrientsByType: NutrientsByType<T>
): T[] => [
	nutrientsByType.basic, 
	nutrientsByType.vitamin, 
	nutrientsByType.mineral
].flat();

export const buildNutrientListTyped = <T extends NutrientGroupable>(
	nutrientsByType: NutrientsByType<T>
): { type: NutrientType; nutrients: T[] }[] => ([
	{ type: "BASIC", nutrients: nutrientsByType.basic },
	{ type: "VITAMIN", nutrients: nutrientsByType.vitamin },
	{ type: "MINERAL", nutrients: nutrientsByType.mineral }
]);

export const buildNutrientListFilter = <T extends NutrientGroupable>(
	nutrients: NutrientsByType<T>,
	type: NutrientType
): T[] => {
	switch(type) {
		case "BASIC": return nutrients.basic;
		case "VITAMIN": return nutrients.vitamin;
		case "MINERAL": return nutrients.mineral;
	}
};

export const buildNutrientsByTypeFromList = <T extends NutrientGroupable> (
	list: T[],
	getType: (n: T) => NutrientType
): NutrientsByType<T> => {
	const grouped = Object.groupBy(list, getType);

	return {
		basic: grouped['BASIC'] ?? [],
		vitamin: grouped['VITAMIN'] ?? [],
		mineral: grouped['MINERAL'] ?? []
	}
};
