import type { Component, InputTypeHTMLAttribute } from "vue";

export type RequestState = {
	isIdle: boolean;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean
};

export type PaginationResult<T> = {
	data: T[];
	totalCount: number;
	pageCount: number;
	currentPage: number;
};

export type InputField = {
	label: string;
	labelDetails?: string;
	type: InputTypeHTMLAttribute;
	placeholder: string;
	onFocus: () => void;
	onBlur: () => void;
};

export type NavConfig = {
	links: {
		to: string;
		label: string;
		icon: Component
	}[],
	linkBaseTwClass?: string;
}
