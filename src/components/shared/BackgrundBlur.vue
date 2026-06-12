<script setup lang="ts">
defineProps<{
	isVisible: boolean;
}>();

const emit = defineEmits<{
	click: []
}>();
</script>

<template>
	<div 
		@click="emit('click')"
		class="w-full h-full absolute top-0 left-0"
		:class="[
			isVisible 
				? 'bg-dark-tertiary/60 backdrop-blur-xs'
				: '-z-1'
		]"
	/>
</template>