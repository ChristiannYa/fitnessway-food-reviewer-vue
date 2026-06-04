<script setup lang="ts">
import type { EdibleBaseSchema } from '@/schemas/EdibleBaseSchema';
import type { NutrientSchema } from '@/schemas/NutrientSchema';
import { isBarcodeValid as uIsBarcodeValid } from "@/utils/textUtils";
import { computed, ref, watch } from 'vue';
import EdibleBaseForm from './EdibleBaseForm.vue';
import NutrientsForm from './NutrientsForm.vue';
import { EDIBLE_TYPE, type AppEdibleSubmitReq, type EdibleType } from '@/types/foodTypes';
import type { NutrientIdWithAmount } from '@/types/nutrientTypes.ts';
import type { RequestState } from '@/types/appTypes.ts';
import Spinner from '@/components/shared/Spinner.vue';
import ActionButton from '@/components/shared/ActionButton.vue';
import EdibleRadio from './EdibleRadio.vue';
import EdibleBarcodeField from './EdibleBarcodeField.vue';
import { useErrorTimeout } from '@/hooks/composables/useErrorTimeout.ts';
import TemporaryError from '@/components/shared/TemporaryError.vue';

const {
	currentStep,
	reqState,
} = defineProps<{
	currentStep: number;
	reqState: RequestState;
	visibleSubmissionError: string | null;
}>();

const emit = defineEmits<{
	'validation-change': [isValid: boolean];
	'req-change': [req: AppEdibleSubmitReq | null];
	'start-over': []
}>();

const {
	isError: isSubmitErrorTimed,
	triggerError: triggerSubmitErrorTimed
} = useErrorTimeout();

const edibleType = ref<EdibleType>("FOOD");

const baseForm = ref<EdibleBaseSchema | null>(null);
const isBaseFormValid = ref(false);

const nutrientsForm = ref<NutrientSchema | null>(null);
const isNutrientsFormValid = ref(false);

const vitaminsForm = ref<NutrientSchema | null>(null);
const isVitaminsFormValid = ref(false);

const mineralsForm = ref<NutrientSchema | null>(null);
const isMineralsFormValid = ref(false);

const barcode = ref("");
const isBarcodeValid = computed(() => uIsBarcodeValid(barcode.value));

const isNextEnabled = computed(() => {
	switch (currentStep) {
		case 1: return isBaseFormValid.value;
		case 2: return isNutrientsFormValid.value;
		case 3: return isVitaminsFormValid.value;
		case 4: return isMineralsFormValid.value;
		case 5: return isBarcodeValid.value;
		default: return false;
	};
});

const requestForm = computed((): AppEdibleSubmitReq | null => {
	const finalNutrientList = getFinalNutrientListOrNull();

	if (baseForm.value === null || finalNutrientList === null) return null;

	return ({
		edibleRequest: {
			base: baseForm.value,
			nutrients: finalNutrientList,
			edibleType: edibleType.value
		},
		barcode: barcode.value
	})
});

const isContentVisible = computed(() => {
	return reqState.isIdle || reqState.isError
})

function getFinalNutrientListOrNull(): NutrientIdWithAmount[] | null {
	if (nutrientsForm.value === null ||
		vitaminsForm.value === null ||
		mineralsForm.value === null
	) return null;

	const nutrients: NutrientIdWithAmount[] = [
		nutrientsForm.value,
		vitaminsForm.value,
		mineralsForm.value
	].flatMap(nutrientSchema =>
		Object
			.entries(nutrientSchema)
			.map(([id, amount]) => ({
				id: Number(id),
				amount
			}))
	);

	return nutrients;
}


watch(isNextEnabled, (wIsNextEnabled) => {
	emit('validation-change', wIsNextEnabled);
}, { immediate: true });

watch(requestForm, (wRequestForm) => {
	emit('req-change', wRequestForm);
}, { immediate: true });

watch(() => reqState, (wReqState) => {
	if (wReqState.isError) triggerSubmitErrorTimed();
})
</script>

<template>
	<div class="flex flex-col gap-y-0">
		<div
			v-show="isContentVisible"
			class="flex flex-col gap-y-4"
			:class="[
				currentStep >= 2
				? 'overflow-scroll no-scrollbar pb-5'
				: ''
			]"
			@wheel="(e) => {
				if (currentStep >= 2) {
					// Allows proper usage of the scroll wheel when modifying
					// the amount values with it
					e.stopImmediatePropagation();
				}
			}"
		>
			<EdibleRadio
				v-if="currentStep === 1"
				v-model="edibleType"
				:values="EDIBLE_TYPE"
			/>
			
			<EdibleBaseForm
				v-show="currentStep === 1"
				@validation-change="isBaseFormValid = $event"
				@set="baseForm = $event"
			/>
			
			<NutrientsForm
				v-show="currentStep === 2"
				nutrient-type="BASIC"
				:should-require-any="true"
				@validation-change="isNutrientsFormValid = $event"
				@set="nutrientsForm = $event"
			/>
			
			<NutrientsForm
				v-show="currentStep === 3"
				nutrient-type="VITAMIN"
				:should-require-any="false"
				@validation-change="isVitaminsFormValid = $event"
				@set="vitaminsForm = $event"
			/>
			
			<NutrientsForm
				v-show="currentStep === 4"
				nutrient-type="MINERAL"
				:should-require-any="false"
				@validation-change="isMineralsFormValid = $event"
				@set="mineralsForm = $event"
			/>
			
			<EdibleBarcodeField
				v-show="currentStep === 5 && isContentVisible"
				v-model="barcode"
			/>
		</div>
	
		<Spinner v-if="reqState.isLoading" class="mx-auto"/>
		
		<TemporaryError
			v-if="isSubmitErrorTimed && visibleSubmissionError !== null"
			:error-message="visibleSubmissionError"
			class="w-4/5 mx-auto"
		/>
		
		<ActionButton
			v-if="reqState.isSuccess"
			:label="`Submit another ${edibleType.toLowerCase()}`"
			@click="emit('start-over')"
			background-color="#088f8f"
		/>
	</div>
</template>