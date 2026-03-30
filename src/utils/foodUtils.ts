import type { FoodBase, PendingFoodStatus } from "@/types/foodTypes";
import { Ban, CircleCheckBig, Clock12, type LucideIcon } from "lucide-vue-next";

export const isReviewed = (status: PendingFoodStatus): boolean => status !== "PENDING"

export const getAmountPerServingText = (food: FoodBase): string =>
    `${food.amountPerServing} ${food.servingUnit.toLowerCase()}`

export const getPendingFoodStatusUi = (status: PendingFoodStatus): {
    hex: string;
    Icon: LucideIcon
} => {
    switch (status) {
		case "APPROVED":
			return { hex: "#10b981", Icon: CircleCheckBig };
		case "PENDING":
			return { hex: "#f59e0b", Icon: Clock12 };
		case "REJECTED":
			return { hex: "#ef4444", Icon: Ban };
	}
}