import type { InputTypeHTMLAttribute } from "vue";

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
