<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'

const {
    label,
    icon,
    bgColor,
    iconSize,
    disabled,
    isActive
} = defineProps<{
    label: string;
    icon?: LucideIcon;
    bgColor?: string
    iconSize?: number
    disabled?: boolean;
    isActive?: boolean
}>()

const emit = defineEmits<{
    click: []
}>()
</script>

<template>
    <button
        @click="emit('click')"
        :disabled="disabled"
        :class="['flex grow justify-center items-center gap-1 py-2 px-3 rounded-xl border-2',
                 'border-transparent text-lg cursor-pointer transition-colors',
                 bgColor,
                 isActive !== undefined && !isActive ? 'hover:border-mist-300' : '']"
    >
        <p class="font-medium">{{ label }}</p>
        <component 
            v-if="icon" 
            :is="icon" 
            :size="iconSize" 
            :stroke-width="3" 
        />
    </button>
</template>