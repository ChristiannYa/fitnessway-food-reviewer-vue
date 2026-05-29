import { nutrientIds } from "@/constants/nutrientConstants";

export type NutrientDvOperation = "DV_TO_UNIT" | "UNIT_TO_DV";

export const getNutrientDv = (
	id: number, 
	amount: number,
	operation: NutrientDvOperation
): number => {

    const calc = (standardDv: number): number => {
		switch (operation) {
			case "DV_TO_UNIT": return (amount / 100) * standardDv;
			case "UNIT_TO_DV": return (amount / standardDv) * 100;
		}
	}

    switch (id) {
        case nutrientIds.base.carbs:       return calc(275);
        case nutrientIds.base.chol:        return calc(300);
        case nutrientIds.base.fiber:       return calc(28);
        case nutrientIds.base.protein:     return calc(50);
        case nutrientIds.base.sodium:      return calc(2300);

		case nutrientIds.vitamins.a:       return calc(900);
        case nutrientIds.vitamins.b12:     return calc(2.4);
        case nutrientIds.vitamins.c:       return calc(90);
        case nutrientIds.vitamins.d:       return calc(20);

        case nutrientIds.minerals.calcium:   return calc(1300);
        case nutrientIds.minerals.iron:      return calc(18);
        case nutrientIds.minerals.magnesium: return calc(420);
        case nutrientIds.minerals.potassium: return calc(4700);

        default: throw new RangeError(`Nutrient with id #${id} does not support %DV conversion`);
    }
}