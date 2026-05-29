<script setup lang="ts">

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();
</script>

<template>
	<div>
		<input 
			type="text"
			placeholder="011110150974"
			class="input-base bg-smoke/20 rounded-full border-2 border-smoke 
				 focus:border-accent-primary text-center p-3 w-full"
			@input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
		>
	</div>
</template>