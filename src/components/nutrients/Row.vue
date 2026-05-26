<script setup lang="ts">
import type { NutrientDataAmount } from '@/types/nutrientTypes';

const { nutrientDataAmount } = defineProps<{
    nutrientDataAmount: NutrientDataAmount
}>()

const base = nutrientDataAmount.data.base
</script>

<template>
    <div class="flex items-center gap-2 py-1">
        <p class="flex-1 truncate">
            {{ base.symbol ? `${base.name} (${base.symbol})` : base.name }}
        </p>

        <p class="font-medium">
            {{ nutrientDataAmount.amount }}

            <span class="font-normal text-gray-400">
                {{ base.unit.toLowerCase() }}
            </span>
        </p>
    </div>
</template>