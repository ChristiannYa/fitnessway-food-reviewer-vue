<script setup lang="ts">
import type { NutrienDataAmount } from '@/types/nutrientTypes';
import Row from './Row.vue';

defineProps<{
    nutrientsInFood: NutrienDataAmount[]
}>()
</script>

<template>
    <div 
        v-if="nutrientsInFood.length > 0"
        class="bg-dark-tertiary/40 rounded-lg divide-y divide-smoke/20 px-3 py-1"
    >
        <Row 
            v-for="nutrientInFood in nutrientsInFood" 
            :key="nutrientInFood.data.base.id"
            :nutrient-in-food="nutrientInFood" 
        />  
    </div>
</template>