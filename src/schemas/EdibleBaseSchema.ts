import { SERVING_UNIT } from "@/types/foodTypes";
import z from "zod";

export const buildEdibleBaseSchema = (isBrandOptional: boolean = false) => {
	const letterRegex = /[a-zA-Z]/;
	const letterRegexMessage = "Must contain at least 1 letter";

	const brandBase = z
		.string()
		.min(2)
		.regex(letterRegex, letterRegexMessage);

	return z.object({
		name: z
			.string()
			.min(2)
			.max(50)
			.regex(letterRegex, letterRegexMessage),
		brand: isBrandOptional 
			? brandBase.optional() 
			: brandBase,
		amountPerServing: z.coerce.number().positive(),
		servingUnit: z.enum(SERVING_UNIT)
	});
};

export type EdibleBaseSchema = z.infer<ReturnType<typeof buildEdibleBaseSchema>>;