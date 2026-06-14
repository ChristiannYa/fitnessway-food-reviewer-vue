<script setup lang="ts">
import EdibleOverview from '@/components/foods/EdibleOverview.vue';
import ActionButton from '@/components/shared/ActionButton.vue';
import type { EdibleType, FoodBase, WriteType } from '@/types/foodTypes';
import type { NutrientDataAmount, NutrientsByType } from '@/types/nutrientTypes';
import { stringToTitleCase } from '@/utils/textUtils';

defineProps<{
	edibleType: EdibleType,
	edibleBase: FoodBase,
	nutrientsByType: NutrientsByType<NutrientDataAmount>,
	barcode: string;
	writeType: WriteType;
}>();

const emit = defineEmits<{
	cancel: [],
	write: [],
}>();
</script>

<template>
	<aside class="flex flex-col gap-y-4 p-4 bg-dark-secondary border border-accent-primary/60 
				  rounded-lg transition-opacity overflow-y-hidden w-96 max-w-5/6 max-h-3/5 
				  absolute top-1/10 left-1/2 -translate-x-1/2">
		<p class="text-center text-sm leading-none opacity-60">
			<b>{{ stringToTitleCase(edibleType) }}</b> Overview
		</p>

		<EdibleOverview 
			:edible-base="edibleBase" 
			:nutrients-by-type="nutrientsByType" 
			class="overflow-y-scroll no-scrollbar"
		/>

		<p class="text-xs text-center opacity-60">{{ barcode }}</p>

		<div class="flex gap-x-2">
			<ActionButton
				v-if="writeType === 'SUBMIT'"
				label="Cancel"
				background-color="#6a7282"
				class="grow"
				@click="emit('cancel')"
			/>
			<ActionButton
				:label="`${stringToTitleCase(writeType)}`"
				background-color="#088f8f"
				@click="emit('write')"
				class="grow"
			/>
		</div>
	</aside>
</template>