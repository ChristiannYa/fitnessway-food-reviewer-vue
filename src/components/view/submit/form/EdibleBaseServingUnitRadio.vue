<script setup lang="ts">
import { SERVING_UNIT } from '@/types/foodTypes';

defineProps<{
	modelValue: string;
}>();

defineEmits<{
	'update:modelValue': [value: string];
}>();
</script>

<template>
	<div class="flex justify-center gap-3">
		<label 
			v-for="unit in SERVING_UNIT"
			:key="unit"
			class="text-cyan-440 text-lg font-semibold cursor-pointer"
		>
			<input 
				type="radio"
				:value="unit"
				:checked="modelValue === unit"
				@change="$emit('update:modelValue', unit)"
			>
			{{ unit.toLowerCase() }}
		</label>
	</div>
</template>