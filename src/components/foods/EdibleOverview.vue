<script setup lang="ts">
import type { FoodBase } from "@/types/foodTypes";
import type {
    NutrientDataAmount,
    NutrientsByType,
} from "@/types/nutrientTypes";
import EdibleBase from "./EdibleBase.vue";
import Nutrients from "@/components/nutrients/Nutrients.vue";

defineProps<{
    edibleBase: FoodBase;
    nutrientsByType: NutrientsByType<NutrientDataAmount>;
}>();
</script>

<template>
    <section class="flex flex-col gap-y-2">
        <EdibleBase :food-base="edibleBase" />
        <Nutrients :nutrients="nutrientsByType" />
    </section>
</template>
