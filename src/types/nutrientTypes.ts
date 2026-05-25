import type { ServingUnit } from "@/types/foodTypes";

export interface NutrientGroupable {
	readonly typeDerived: NutrientType;
}

export const NUTRIENT_TYPE = ["BASIC", "VITAMIN", "MINERAL"] as const;
export type NutrientType = (typeof NUTRIENT_TYPE)[number];

export type NutrientsByType<T extends NutrientGroupable> = {
    basic: T[];
    vitamin: T[];
    mineral: T[];
};

export type NutrientBase = {
	id: number;
	name: string;
	unit: ServingUnit;
	type: NutrientType;
	symbol?: string;
	isPremium: boolean;
};

export type NutrientPreferences = {
	hexColor?: string;
	goal?: number;
};

export type NutrientData = NutrientGroupable & {
	base: NutrientBase;
	preferences: NutrientPreferences;
};

export type NutrienDataAmount = NutrientGroupable & {
	data: NutrientData;
	amount: number;
};

export type NutrientIdWithAmount = {
	id: number;
	amount: number;
};

export type NutrientsRes = {
	nutrients: NutrientsByType<NutrientData>;
}