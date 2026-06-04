<script setup lang="ts">
import type { NutrientDataAmount } from '@/types/nutrientTypes';
import NutrientAmountRow from './NutrientAmountRow.vue';

defineProps<{
    nutrientDataAmountArr: NutrientDataAmount[]
}>()
</script>

<template>
    <div 
        v-if="nutrientDataAmountArr.length > 0"
        class="bg-dark-tertiary/40 rounded-lg divide-y divide-smoke/20 border border-smoke/20 px-3 py-1"
    >
        <NutrientAmountRow
            v-for="nutrientDataAmount in nutrientDataAmountArr" 
            :key="nutrientDataAmount.data.base.id"
            :nutrientDataAmount="nutrientDataAmount" 
        />  
    </div>
</template>