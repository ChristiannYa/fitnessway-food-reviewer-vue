<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'
import type { CSSProperties } from "vue";

type Props = {
    label: string;
	borderColor?: CSSProperties["borderColor"];
	borderHoverColor?: CSSProperties["borderColor"];
	backgroundColor?: CSSProperties["background-color"];    
	icon?: LucideIcon;
    iconSize?: number;
	isInverted?: boolean;
    isDisabled?: boolean;
    isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	borderColor: "transparent",
	borderHoverColor: "transparent",
	backgroundColor: "transparent"
})

const emit = defineEmits<{
    click: []
}>()
</script>

<template>
    <button
        @click="emit('click')"
        :disabled="isDisabled"
		:style="{
			borderWidth: '2px',
			'--border-color': borderColor,
			'--hover-border-color': borderHoverColor,
			backgroundColor: backgroundColor,
		}"
		class="flex grow justify-center items-center gap-1 py-2 px-3 rounded-xl
			   text-lg transition-colors"
        :class="[
			isInverted 
				? 'flex-row-reverse' 
				: '',
			isActive !== undefined && !isActive 
				? 'inactive' 
				: '',
			isDisabled === false 
				? 'opacity-100 cursor-pointer' 
				: 'opacity-50 cursor-default'
		]"
    >
        <p class="font-medium text-md leading-tight">{{ label }}</p>
        <component 
            v-if="icon" 
            :is="icon" 
            :size="iconSize" 
            :stroke-width="3" 
        />
    </button>
</template>

<style scoped>
button {
    border-color: var(--border-color, transparent);
}

.inactive:hover {
    border-color: var(--hover-border-color);
}
</style>