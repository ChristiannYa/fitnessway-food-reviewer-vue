import type { NutrientDataAmount, NutrientGroupable, NutrientIdWithAmount, NutrientsByType } from "@/types/nutrientTypes";
import type { PaginationResult } from "@/types/appTypes";

export const EDIBLE_TYPE = ["FOOD", "SUPPLEMENT"] as const;
export type EdibleType = typeof EDIBLE_TYPE[number];

export const SERVING_UNIT = ["G", "MG", "MCG", "ML", "OZ", "KCAL"] as const;
export type ServingUnit = typeof SERVING_UNIT[number];

export const PENDING_FOOD_STATUS = ["APPROVED", "PENDING", "REJECTED"] as const
export type PendingFoodStatus = typeof PENDING_FOOD_STATUS[number]

export type WriteType = "UPDATE" | "SUBMIT";

export type FoodBase = {
	name: string;
	brand: string | undefined;
	amountPerServing: number;
	servingUnit: ServingUnit;
};

export type FoodInformation<T extends NutrientGroupable> = {
	base: FoodBase;
	nutrients: NutrientsByType<T>;
	type: EdibleType
};

export type AppFood = {
	id: number;
	information: FoodInformation<NutrientDataAmount>;
	createdBy?: string;
	createdAt: string;
	updatedAt?: string;
};

export type AppEdibleData = {
	edible: AppFood;
	barcode: string;
};

export type PendingFood = {
	id: number;
	information: FoodInformation<NutrientDataAmount>;
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

export type AppEdibleByIdRes = {
	appEdible?: AppEdibleData;
};

export type AppEdibleByBarcodeRes = {
	appEdible: AppEdibleData | null;
}

export type AdminEdibleSubmissionsReqParams = {
	offset: number;
	date?: string;
};

export type AdminEdibleSubmissionsRes = {
	submittedAppEdibles: PaginationResult<AppEdibleData>;
};

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

export type AppEdibleWriteReq = {
	edibleRequest: {
		base: FoodBase,
		nutrients: NutrientIdWithAmount[],
		edibleType: EdibleType
	};
	barcode: string;
}

export type ApPedibleSubmitRes = {
	appEdible: AppFood
}
