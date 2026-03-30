import type { NutrientsByType } from "@/types/nutrientTypes";
import type { PaginationResult } from "@/types/appTypes";

export type ServingUnit = "G" | "MG" | "MCG" | "ML" | "OZ" | "KCAL"

export const PENDING_FOOD_STATUS = ["APPROVED", "PENDING", "REJECTED"] as const
export type PendingFoodStatus = typeof PENDING_FOOD_STATUS[number]

export type FoodBase = {
	name: string;
	brand?: string;
	amountPerServing: number;
	servingUnit: ServingUnit;
};

export type FoodInformation = {
	base: FoodBase;
	nutrients: NutrientsByType;
};

export type AppFood = {
	id: number;
	information: FoodInformation;
	createdBy?: string;
	createdAt: string;
	updatedAt?: string;
};

export type PendingFood = {
	id: number;
	information: FoodInformation;
	status: PendingFoodStatus;
	createdBy?: string;
	reviewedBy?: string;
	reviewedAt?: string;
	createdAt: string;
	rejectionReason?: string;
};

export type PendingFoodReview = Pick<
	PendingFood,
	"status" | "createdBy" | "reviewedBy" | "reviewedAt" | "rejectionReason"
>;

export type PendingFoodsReqParams = (
    | { userId: string, userType?: never } 
    | { userId?: never, userType: string }
) & {
    status?: PendingFoodStatus,
    offset: number
}

export type PendingFoodsByUserIdRes = {
	pendingFoodsPagination: PaginationResult<PendingFood>;
};

export type PendingFoodsByUserTypeRes = {
	pendingFoodsPagination: PaginationResult<PendingFood>;
};

export type PendingFoodReviewReq = {
	pendingFoodId: number;
	rejectionReason: string | null;
};

export type PendingFoodReviewRes = {
	pendingFoodReviewed: PendingFood;
};