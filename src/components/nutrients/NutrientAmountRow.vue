<script setup lang="ts">
import type { NutrientDataAmount } from '@/types/nutrientTypes';
import { computed } from 'vue';

const { nutrientDataAmount } = defineProps<{
    nutrientDataAmount: NutrientDataAmount
}>()

const base = computed(() => nutrientDataAmount.data.base)
</script>

<template>
    <div class="flex items-center gap-2 py-1">
		<div class="truncate flex flex-1 gap-x-1">
			<p>{{ base.name }}</p>
			<span class="opacity-60">
				{{ base.symbol && base.type === 'MINERAL' 
					? base.symbol 
					: '' 
				}}
			</span>
		</div>

        <p class="font-medium">
            {{ nutrientDataAmount.amount }}

            <span class="font-normal text-gray-400">
                {{ base.unit.toLowerCase() }}
            </span>
        </p>
    </div>
</template>