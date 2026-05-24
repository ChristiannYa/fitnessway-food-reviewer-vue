<script setup lang="ts">
import { computed } from 'vue';

const {
    pageCount,
    currentPage
} = defineProps<{
    pageCount: number;
	currentPage: number;
}>()

const emit = defineEmits<{
    pageChange: [page: number]
}>()

const pages = computed(() => Array.from({ length: pageCount }, (_, i) => i + 1))
</script>

<template>
    <div v-if="pageCount > 0" class="flex justify-center gap-3">
        <button
            v-for="page in pages"
            :key="page"
            @click="emit('pageChange', page)"
            :class="['w-8 h-8 rounded-full font-semibold leading-none cursor-pointer',
                    page === currentPage ? 'bg-accent-primary' : 'bg-smoke']"
        >
            {{ page }}
        </button>
    </div>
</template>