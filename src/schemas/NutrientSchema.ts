import type { NutrientData } from "@/types/nutrientTypes";
import z from "zod"

export const buildNutrientSchema = (
	nutrients: NutrientData[],
	shouldRequireAny: boolean
) => {
	const shape = Object.fromEntries(
		nutrients.map(nutrient => [
			nutrient.base.id,
			z.coerce.number().min(0)
		])
	);

	if (shouldRequireAny) {
		return z.object(shape).refine(
			(data) => Object.values(data).some(amount => amount > 0),
			{ message: "At least one nutrient must have a value greater than 0" }
		)
	}

  	return z.object(shape);
};

export type NutrientSchema = Record<string, number>;
