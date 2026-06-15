import { nutrientIds } from "@/constants/nutrientConstants";
import type { NutrientBase } from "@/types/nutrientTypes";

export type NutrientDvOperation = "DV_TO_UNIT" | "UNIT_TO_DV";

export const getNutrientDv = (
	id: number, 
	amount: number,
	operation: NutrientDvOperation
): number => {

    const dv = (standardDv: number): number => {
		switch (operation) {
			case "DV_TO_UNIT": return (amount / 100) * standardDv;
			case "UNIT_TO_DV": return (amount / standardDv) * 100;
		}
	};

	switch (id) {
		case nutrientIds.base.carbs:               return dv(275);
		case nutrientIds.base.chol:                return dv(300);
		case nutrientIds.base.fiber:               return dv(28);
		case nutrientIds.base.protein:             return dv(50);
		case nutrientIds.base.sodium:              return dv(2300);
		case nutrientIds.base.saturatedFat:        return dv(20);
		case nutrientIds.base.addedSugar:          return dv(50);

		case nutrientIds.vitamins.a:               return dv(900);
		case nutrientIds.vitamins.thiamin:         return dv(1.2);
		case nutrientIds.vitamins.niacin:          return dv(16);
		case nutrientIds.vitamins.pantothenicAcid: return dv(5);
		case nutrientIds.vitamins.b6:              return dv(1.7);
		case nutrientIds.vitamins.biotin:          return dv(30);
		case nutrientIds.vitamins.folate:          return dv(400);
		case nutrientIds.vitamins.b12:             return dv(2.4);
		case nutrientIds.vitamins.c:               return dv(90);
		case nutrientIds.vitamins.d:               return dv(20);
		case nutrientIds.vitamins.e:               return dv(15);
		case nutrientIds.vitamins.k:               return dv(120);

		case nutrientIds.minerals.calcium:         return dv(1300);
		case nutrientIds.minerals.iron:            return dv(18);
		case nutrientIds.minerals.magnesium:       return dv(420);
		case nutrientIds.minerals.potassium:       return dv(4700);
		case nutrientIds.minerals.zinc:            return dv(11);
		case nutrientIds.minerals.selenium:        return dv(55);
		case nutrientIds.minerals.phosphorus:      return dv(1250);
		case nutrientIds.minerals.manganese:       return dv(2.3);
		case nutrientIds.minerals.iodine:          return dv(150);
		case nutrientIds.minerals.copper:          return dv(0.9);

		default: throw new RangeError(`Nutrient with id #${id} does not support %DV conversion`);
	};
};

export const getNutrientLabelInfo = (base: NutrientBase) =>
	isNutrientSymbolVisible(base) 
		? `(${base.symbol}) ${base.unit.toLowerCase()}` 
		: `${base.unit.toLowerCase()}`

export const isNutrientSymbolVisible = (base: NutrientBase) => 
	base.type !== "BASIC" && base.name.length > 3;
