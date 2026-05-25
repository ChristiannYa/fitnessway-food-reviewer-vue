<script setup lang="ts">
import type { NutrienDataAmount } from '@/types/nutrientTypes';

const { nutrientInFood } = defineProps<{
    nutrientInFood: NutrienDataAmount
}>()

const base = nutrientInFood.data.base
</script>

<template>
    <div class="flex items-center gap-2 py-1">
        <p class="flex-1 truncate">
            {{ base.symbol ? `${base.name} (${base.symbol})` : base.name }}
        </p>

        <p class="font-medium">
            {{ nutrientInFood.amount }}

            <span class="font-normal text-gray-400">
                {{ base.unit.toLowerCase() }}
            </span>
        </p>
    </div>
</template>