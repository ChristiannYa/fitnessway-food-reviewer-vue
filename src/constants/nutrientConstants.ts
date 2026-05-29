export const nutrientIds = {
    base: {
        cals:        1,
        carbs:       2,
        chol: 3,
        fats:        4,
        fiber:       5,
        protein:     6,
        sodium:      7,
        sugar:       8,
    },
    vitamins: {
        a:   9,
        b12: 10,
        c:   11,
        d:   12,
    },
    minerals: {
        calcium:   13,
        iron:      14,
        magnesium: 15,
        potassium: 16,
    },
} as const;

export const nutrientDvArray = [
    nutrientIds.base.carbs,
    nutrientIds.base.chol,
    nutrientIds.base.fiber,
    nutrientIds.base.protein,
    nutrientIds.base.sodium,
	
    nutrientIds.vitamins.a,
    nutrientIds.vitamins.b12,
    nutrientIds.vitamins.c,
    nutrientIds.vitamins.d,

    nutrientIds.minerals.calcium,
    nutrientIds.minerals.iron,
    nutrientIds.minerals.magnesium,
    nutrientIds.minerals.potassium,
] as const;