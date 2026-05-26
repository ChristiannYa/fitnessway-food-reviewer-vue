<script setup lang="ts">
import type { NutrientDataAmount } from '@/types/nutrientTypes';
import Row from './Row.vue';

defineProps<{
    nutrientDataAmountList: NutrientDataAmount[]
}>()
</script>

<template>
    <div 
        v-if="nutrientDataAmountList.length > 0"
        class="bg-dark-tertiary/40 rounded-lg divide-y divide-smoke/20 px-3 py-1"
    >
        <Row 
            v-for="nutrientDataAmount in nutrientDataAmountList" 
            :key="nutrientDataAmount.data.base.id"
            :nutrientDataAmount="nutrientDataAmount" 
        />  
    </div>
</template>