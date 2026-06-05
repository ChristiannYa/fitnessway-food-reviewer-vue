<script setup lang="ts">
import type { InputField } from "@/types/appTypes";
import { isMobile } from "@/utils/appUtils";

const props = defineProps<{
	modelValue: string | number | undefined;
	inputData: InputField;
	isFocused: boolean;
	errorMessage: string | undefined;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: string];
	reset: [];
}>();

function onInput(e: InputEvent) {
	if (props.errorMessage !== undefined) emit('reset');
	const value = (e.target as HTMLInputElement).value;
	emit('update:modelValue', value);
};
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
				<p class="cursor-default shrink-0">
					{{ inputData.label }}
					<span 
						v-if="inputData.labelDetails"
						class="opacity-40 text-sm"
					>
						{{ inputData.labelDetails }}
					</span>
				</p>
				<div 
					class="flex flex-1 min-w-0"
					:class="[
						isMobile() ? 'gap-x-2' : ''
					]"
				>
					<input 
						:value="props.modelValue === 0 ? '' : props.modelValue"
						:type="inputData.type"
						:placeholder="inputData.placeholder"
						class="input-base py-3 text-end flex-1 min-w-0"
						@input="onInput"
						@focus="inputData.onFocus"
						@blur="inputData.onBlur"
					>
					<slot/>
				</div>
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
