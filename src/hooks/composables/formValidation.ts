import type { InputField } from "@/types/appTypes";
import type { InputTypeHTMLAttribute } from "vue";
import type { ZodObject, ZodRawShape } from "zod";
import { computed, reactive } from "vue";
import type { ComputedRef } from "vue";

type FormPartial<TValue> = Partial<Record<string, TValue>>;

type FieldData = { 
	field: InputField, 
	deleteError: () => void 
};

type FormValidation = {
	focusedFields: Readonly<FormPartial<boolean>>;
	errorFields: Readonly<FormPartial<string>>;
	touchedFields: Readonly<FormPartial<boolean>>;
	isValid: ComputedRef<boolean>;
	buildFieldData: (
		label: string,
		placeholder: string,
		type: InputTypeHTMLAttribute,
	) => FieldData;
};

export function useFormValidation<TForm>(
	schema: ZodObject<ZodRawShape>, 
	form: TForm
): FormValidation {
	const focusedFields = reactive<FormPartial<boolean>>({});
	const errorFields = reactive<FormPartial<string>>({});
	const touchedFields = reactive<FormPartial<boolean>>({});

	const isValid = computed(() => {
		const result = schema.safeParse(form);
	
		if (!result.success) {
			result.error.issues.forEach(issue => {
				const key = issue.path[0] as string;
				errorFields[key] = issue.message;
			});
			return false;
		}
	
		return true;
	});

	function buildFieldData (
		label: string,
		placeholder: string,
		type: InputTypeHTMLAttribute = "text",
	): FieldData {
		const key = label.toLowerCase();

		return {
			field: {
				label, 
				type, 
				placeholder,
				onFocus: () => { focusedFields[key] = true },
				onBlur: () => {
					focusedFields[key] = false;
					touchedFields[key] = true;
				}
			},
			deleteError: () => delete errorFields[key]
		}
	};

	return {
		focusedFields,
		errorFields,
		touchedFields,
		isValid,
		buildFieldData
	}
}
