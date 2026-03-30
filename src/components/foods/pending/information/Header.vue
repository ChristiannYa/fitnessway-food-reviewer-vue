<script setup lang="ts">
import type { PendingFood } from '@/types/foodTypes';
import { getPendingFoodStatusUi, isReviewed } from '@/utils/foodUtils';
import { formatIsoDate } from '@/utils/textUtils';
import { computed } from 'vue';

const { pendingFood } = defineProps<{
    pendingFood: PendingFood
}>()

const emit = defineEmits<{
    viewReview: []
}>()

const statusUi = computed(() => getPendingFoodStatusUi(pendingFood.status))
</script>

<template>
    <div
        class="flex items-center justify-between px-4 py-3 border-b border-smoke
               border-dotted text-lg"
    >
        <p>{{ formatIsoDate(pendingFood.createdAt) }}</p>

        <div class="flex flex-col items-center">
            <p
                :style="{
                    color: statusUi.hex
                }"
                class="font-bold leading-tight"
            >
                {{ pendingFood.status }}
            </p>
            <button
                v-if="isReviewed(pendingFood.status)"
                @click="emit('viewReview')"
                class="text-xs opacity-70 cursor-pointer"
            >
                See more
            </button>
        </div>
    </div>
</template>