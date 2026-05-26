<script setup lang="ts">
defineProps<{
	amount: number;
	current: number;
}>();

const steps = Array.from({ length: 5 }, (_, i) => i + 1);
</script>

<template>
	<div>
		<span
			v-for="step in steps"
			:class="[
				'border-3 border-accent-primary rounded-full flex-1',
				step <= current
					? 'opacity-100'
					: 'opacity-10'
			]"
		/>
	</div>
</template>