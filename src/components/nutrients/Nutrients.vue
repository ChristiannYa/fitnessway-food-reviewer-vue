<script setup lang="ts">
import type {
    NutrientDataAmount,
    NutrientsByType,
} from "@/types/nutrientTypes";
import NutrientSection from "./NutrientSection.vue";

defineProps<{
    nutrients: NutrientsByType<NutrientDataAmount>;
}>();
</script>

<template>
    <NutrientSection :nutrientDataAmountArr="nutrients.basic" />
    <NutrientSection :nutrient-data-amount-arr="nutrients.vitamin" />
    <NutrientSection :nutrient-data-amount-arr="nutrients.mineral" />
</template>
