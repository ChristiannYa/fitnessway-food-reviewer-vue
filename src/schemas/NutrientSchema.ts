import z from "zod"

export const buildNutrientSchema = (isOptional: boolean = false) => {
  const amountBase = z.number().positive();

  return z.object({
    amount: isOptional 
		? amountBase.optional() 
		: amountBase,
  });
};