<script setup lang="ts">
import type { PendingFoodReview } from '@/types/foodTypes';
import { getPendingFoodStatusUi } from '@/utils/foodUtils';
import { formatIsoDate } from '@/utils/textUtils';
import { Minus } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
    review: PendingFoodReview
}>()

const emit = defineEmits<{
    close: []
}>()

const statusUi = computed(() => getPendingFoodStatusUi(props.review.status))
</script>

<template>
    <div
        :style="{
            border: `solid 2px ${statusUi.hex}80`,
            borderRadius: 12
        }"
        class="w-full h-full absolute py-2 bg-black/60 backdrop-blur-md"
    >
        <div class="flex flex-col gap-4 px-4 relative h-full">
            <button 
                @click="emit('close')"
                class="flex justify-center items-center absolute right-2
                           w-5 h-5 rounded-full bg-dry-green cursor-pointer"
            >
                <Minus :size="12" :stroke-width="4"/>
            </button>

            <div class="text-center shrink-0">
                <h2 class="text-lg font-bold">Review Date</h2>
                <p v-if="review.reviewedAt">
                    {{ formatIsoDate(review.reviewedAt) }}
                </p>
            </div>

            <div 
                v-if="review.rejectionReason"
                class="flex flex-col min-h-0 grow"
            >
                <h2 class="font-medium shrink-0">Reason</h2>
                <p class="opacity-70 overflow-y-auto no-scrollbar">
                    {{ review.rejectionReason }}
                </p>
            </div>

            <div class="grow flex justify-center items-end">
                <p class="text-xs text-center opacity-70">{{ review.reviewedBy }}</p>
            </div>
        </div>
    </div>
</template>