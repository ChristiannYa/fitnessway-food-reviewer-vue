import type { ServingUnit } from "@/types/foodTypes";

export type NutrientType = "BASIC" | "VITAMIN" | "MINERAL"

export type NutrientsByType = {
    basic: NutrientInFood[];
    vitamins: NutrientInFood[];
    minerals: NutrientInFood[];
}

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

export type NutrientData = {
	base: NutrientBase;
	preferences: NutrientPreferences;
};

export type NutrientInFood = {
	nutrientData: NutrientData;
	amount: number;
};

export type NutrientIdWithAmount = {
	id: number;
	amount: number;
};