export type UserType = "ADMIN" | "CONTRIBUTOR"

export const USER_SEARCH_SCOPE = ["Type", "ID"] as const
export type UserSearchScope = (typeof USER_SEARCH_SCOPE)[number]

export type User = {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	isPremium: boolean;
	createdAt: string;
	updatedAt: string;
	type: UserType;
};

export type UserRes = {
	user: User;
};