<script setup lang="ts">
import { PENDING_FOOD_STATUS, type PendingFoodStatus } from '@/types/foodTypes';
import { getPendingFoodStatusUi } from '@/utils/foodUtils';

const {
    pendingFoodStatus
} = defineProps<{
    pendingFoodStatus: PendingFoodStatus | null
}>()

const emit = defineEmits<{
    select: [status: PendingFoodStatus]
}>()

const getIconColor = (s: PendingFoodStatus) => {
    const { hex } = getPendingFoodStatusUi(s)
    return pendingFoodStatus === s ? hex : `${hex}50`
}

const getIcon = (s: PendingFoodStatus) => getPendingFoodStatusUi(s).Icon
</script>

<template>
    <div class="flex gap-2 w-fit">
        <button
            v-for="status in Object.values(PENDING_FOOD_STATUS)"
            :key="status"
            @click="emit('select', status)"
            class="p-1.5 rounded-full cursor-pointer"
        >
            <component
                :is="getIcon(status)"
                :size="26"
                :color="getIconColor(status)"
            />
        </button>
    </div>
</template>