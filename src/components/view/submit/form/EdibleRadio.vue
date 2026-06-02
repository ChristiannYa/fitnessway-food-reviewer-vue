<script setup lang="ts">

defineProps<{
	modelValue: string;
	values: readonly string[]
}>();

defineEmits<{
	'update:modelValue': [value: string];
}>();
</script>

<template>
	<div class="flex justify-center gap-3">
		<label 
			v-for="value in values"
			:key="value"
			class="text-cyan-440 text-lg font-semibold cursor-pointer"
		>
			<input 
				type="radio"
				:value="value"
				:checked="modelValue === value"
				@change="$emit('update:modelValue', value)"
			>
			{{ value.toLowerCase() }}
		</label>
	</div>
</template>
