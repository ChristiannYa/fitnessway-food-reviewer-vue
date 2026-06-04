<script setup lang="ts">
import type { FoodBase } from '@/types/foodTypes';
import type { NutrientDataAmount, NutrientsByType } from '@/types/nutrientTypes';
import EdibleBase from './EdibleBase.vue';
import NutrientSection from '../nutrients/NutrientSection.vue';

defineProps<{
	edibleBase: FoodBase,
	nutrientsByType: NutrientsByType<NutrientDataAmount>
}>();
</script>

<template>
	<section class="flex flex-col gap-y-2">
		<EdibleBase :food-base="edibleBase" />
		<NutrientSection :nutrientDataAmountArr="nutrientsByType.basic" />
		<NutrientSection :nutrient-data-amount-arr="nutrientsByType.vitamin" />
		<NutrientSection :nutrient-data-amount-arr="nutrientsByType.mineral" />
	</section>
</template>