<script setup lang="ts">
import type { PendingFood } from '@/types/foodTypes';
import type { UserSearchScope } from '@/types/userTypes';
import { getAmountPerServingText, getPendingFoodStatusUi } from '@/utils/foodUtils';
import { formatIsoDate } from '@/utils/textUtils';

const {
    pendingFood,
    userSearchScope
} = defineProps<{
    pendingFood: PendingFood,
    userSearchScope: UserSearchScope
}>()

const emit = defineEmits<{
    click: [food: PendingFood]
}>()

const foodBase = pendingFood.information.base
const amountPerServing = getAmountPerServingText(foodBase)
const { hex } = getPendingFoodStatusUi(pendingFood.status)
</script>

<template>
    <div 
        @click="emit('click', pendingFood)"
        class="flex flex-col w-full pb-3 pt-1 border-2 border-smoke hover:border-chalk
               cursor-pointer rounded-md text-lg text-chalk hover:text-white"
    >
        <p class="text-center text-sm">{{ formatIsoDate(pendingFood.createdAt) }}</p>

        <p v-if="userSearchScope === 'Type'" class="text-center text-xs opacity-70">
            {{ pendingFood.createdBy }}
        </p>

        <span class="mt-1 w-full border-t border-dotted border-smoke" />

        <div class="flex flex-col px-3 pt-3 leading-snug">
            <p
                :style="{
                    color: hex
                }"
                class="font-semibold"
            >
                {{ pendingFood.status }}
            </p>
            <p class="font-semibold truncate">{{ foodBase.name }}</p>
            <p class="opacity-60">{{ foodBase.brand }}</p>
            <p class="opacity-60">{{ amountPerServing }}</p>
        </div>
    </div>
</template>