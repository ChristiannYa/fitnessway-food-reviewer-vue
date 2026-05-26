<script setup lang="ts"">
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next';
import ActionButton from '@/components/shared/ActionButton.vue';

defineProps<{
	current: number;
	prevStepLabel?: string;
	nextStepLabel: string;
	onPrev: () => void;
	onNext: () => void;
}>();

defineEmits<{
	prev: [];
	next: [];
}>()
</script>

<template>
	<div>
		<ActionButton
			v-if="prevStepLabel"
			:label="prevStepLabel"
			:icon="ArrowLeft"
			:icon-size="16"
			background-color="var(--color-accent-primary)"
			:is-inverted="true"
			@click="onPrev"
			class="flex-1"
		/>
	
		<ActionButton
			:label="nextStepLabel"
			:icon="current < 5 ? ArrowRight : Check"
			:icon-size="16"
			background-color="var(--color-accent-primary)"
			@click="onNext"
			class="flex-1"
		/>
	</div>
</template>