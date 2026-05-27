<script setup lang="ts">
import type { InputField } from "@/types/appTypes";

defineProps<{
	inputData: InputField;
	isFocused: boolean;
	errorMessage: string | undefined;
}>();

defineEmits<{
	'update:modelValue': [value: string];
	reset: [];
}>();
</script>

<template>
	<div class="flex flex-col gap-y-1">
		<div
			class="bg-smoke/20 py-2 px-3 rounded-full border-2"
			:class="[
				isFocused 
					? 'border-accent-primary' 
					: 'border-smoke'
			]"
		>
			<div class="flex items-center gap-1 text-lg leading-tight">
				<p class="cursor-default">{{ inputData.label }}</p>
				<input 
					:type="inputData.type"
					:placeholder="inputData.placeholder"
					class="focus:outline-none font-semibold text-cyan-500 placeholder:text-chalk 
						   placeholder:opacity-30 placeholder:font-normal py-3 flex-1 text-end"
					@input="(e: InputEvent) => {
						if (errorMessage !== undefined) $emit('reset');
						$emit('update:modelValue', (e.target as HTMLInputElement).value);
					}"
					@focus="inputData.onFocus"
					@blur="inputData.onBlur"
				>
			</div>
		</div>
		<p
			v-if="errorMessage"
			class="text-sm text-center text-chalk/50"
		>
			{{ errorMessage }}
		</p>
	</div>
</template>