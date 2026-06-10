<script setup lang="ts"">
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next';
import ActionButton from '@/components/shared/ActionButton.vue';

defineProps<{
	current: number;
	prevStepLabel?: string;
	nextStepLabel: string;
	isNextDisabled: boolean;
	isSubmitting: boolean;
}>();

const emit = defineEmits<{
	prev: [];
	next: [];
}>()
</script>

<template>
	<div>
		<ActionButton
			v-if="prevStepLabel"
			:is-disabled="isSubmitting"
			:label="prevStepLabel"
			:icon="ArrowLeft"
			:icon-size="16"
			background-color="var(--color-accent-primary)"
			:is-inverted="true"
			@click="emit('prev')"
			class="flex-1"
		/>
	
		<ActionButton
			:is-disabled="isSubmitting || isNextDisabled"
			:label="nextStepLabel"
			:icon="current < 5 ? ArrowRight : Check"
			:icon-size="16"
			background-color="var(--color-accent-primary)"
			@click="emit('next')"
			class="flex-1"
		/>
	</div>
</template>