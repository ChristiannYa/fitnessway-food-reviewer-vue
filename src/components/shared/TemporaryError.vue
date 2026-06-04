<script setup lang="ts">
import ui from '@/constants/ui.ts';
import ProgressLine from './ProgressLine.vue';

const props = withDefaults(defineProps<{
	errorMessage: string;
	duration?: number
}>(), {
	duration: ui.errorDurationMs
})
</script>

<template>
	<div class="flex flex-col gap-1">
		<p class="text-red-400 text-center leading-tight">
			{{ errorMessage }}
		</p>

		<ProgressLine
			:duration="duration"
			bg-color="f87171"
		/>
	</div>
</template>
