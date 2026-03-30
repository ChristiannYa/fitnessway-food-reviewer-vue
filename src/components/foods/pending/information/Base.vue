<script setup lang="ts">
import type { FoodBase } from '@/types/foodTypes';
import { getAmountPerServingText } from '@/utils/foodUtils';
import { ref, watch, nextTick } from 'vue';

const {
    foodBase
} = defineProps<{
    foodBase: FoodBase
}>()

const nameRef = ref<HTMLParagraphElement | null>(null)
const isNameTruncated = ref(false)
const isFullNameVisible = ref(false)

function handleNameClick() {
    if (!isNameTruncated.value) return
    isFullNameVisible.value = !isFullNameVisible.value
}

watch(
    [foodBase],
    async () => {
        await nextTick()

        const el = nameRef.value
        if (el) isNameTruncated.value = el.scrollWidth > el.clientWidth
    },
    { immediate: true }
)
</script>

<template>
    <div class="text-lg leading-tight pb-2">
        <p
            ref="nameRef"
            @click="handleNameClick"
            :class="['font-semibold',
                isNameTruncated ? 'cursor-pointer' : '',
                isFullNameVisible ? '' : 'truncate'
            ]"
        >
            {{ foodBase.name }}
        </p>
        <p class="opacity-80 truncate">{{ foodBase.brand }}</p>
        <p class="opacity-80">{{ getAmountPerServingText(foodBase) }}</p>
    </div>
</template>