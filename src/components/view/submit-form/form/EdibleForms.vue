<script setup lang="ts">
import type { EdibleBaseSchema } from '@/schemas/EdibleBaseSchema';
import type { NutrientSchema } from '@/schemas/NutrientSchema';
import { isBarcodeValid as uIsBarcodeValid } from "@/utils/textUtils";
import { computed, ref, useTemplateRef, watch, defineAsyncComponent } from 'vue';
import EdibleBaseForm from './EdibleBaseForm.vue';
import NutrientsForm from './NutrientsForm.vue';
import { EDIBLE_TYPE, type AppEdibleData, type AppEdibleWriteReq, type EdibleType, type WriteType } from '@/types/foodTypes';
import type { NutrientIdWithAmount } from '@/types/nutrientTypes.ts';
import type { RequestState } from '@/types/appTypes.ts';
import Spinner from '@/components/shared/Spinner.vue';
import ActionButton from '@/components/shared/ActionButton.vue';
import EdibleRadio from './EdibleRadio.vue';
import { useErrorTimeout } from '@/hooks/composables/useErrorTimeout.ts';
import TemporaryError from '@/components/shared/TemporaryError.vue';
import { useNutrientSchemaFromList } from '@/hooks/composables/useNutrientsSchemaFromList.ts';
const EdibleBarcodeField = defineAsyncComponent(() => import("./EdibleBarcodeField.vue"));

const {
	currentStep,
	reqState,
	initialEdible,
	writeType
} = defineProps<{
	currentStep: number;
	reqState: RequestState;
	visibleSubmissionError: string | null;
	initialEdible?: AppEdibleData;
	writeType: WriteType
}>();

const emit = defineEmits<{
	'validation-change': [isValid: boolean];
	'req-change': [req: AppEdibleWriteReq | null];
	'start-over': []
}>();

const {
	isError: isSubmitErrorTimed,
	triggerError: triggerSubmitErrorTimed
} = useErrorTimeout();

const edibleType = ref<EdibleType>(initialEdible?.edible.information.type ?? 'FOOD');

const baseForm = ref<EdibleBaseSchema | null>(null);
const baseFormRef = useTemplateRef("baseFormRef");
const isBaseFormValid = ref(false);

const nutrientsForm = ref<NutrientSchema | null>(null);
const nutrientsFormRef = useTemplateRef('nutrientsFormRef');
const initialNutrients = useNutrientSchemaFromList(() => initialEdible?.edible.information.nutrients.basic);
const isNutrientsFormValid = ref(false);

const vitaminsForm = ref<NutrientSchema | null>(null);
const vitaminsFormRef = useTemplateRef('vitaminsFormRef');
const initialVitamins = useNutrientSchemaFromList(() => initialEdible?.edible.information.nutrients.vitamin);
const isVitaminsFormValid = ref(false);

const mineralsForm = ref<NutrientSchema | null>(null);
const mineralsFormRef = useTemplateRef('mineralsFormRef');
const initialMinerals = useNutrientSchemaFromList(() => initialEdible?.edible.information.nutrients.mineral);
const isMineralsFormValid = ref(false);

const barcode = ref(`${initialEdible?.barcode ?? ''}`);
const barcodeRef = useTemplateRef('barcodeRef');
const isBarcodeValid = computed(() => uIsBarcodeValid(barcode.value));

const isNextEnabled = computed(() => {
	switch (currentStep) {
		case 1: return isBaseFormValid.value;
		case 2: return isNutrientsFormValid.value;
		case 3: return isVitaminsFormValid.value;
		case 4: return isMineralsFormValid.value;
		case 5: {
			const finalNutrients = getFinalNutrientListOrNull();
			return isBarcodeValid.value &&
				   finalNutrients !== null &&
				   finalNutrients.length > 0;
		};
		default: return false;
	};
});

const requestForm = computed((): AppEdibleWriteReq | null => {
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
});

const startOverLabel = computed((): string => {
	switch (writeType) {
		case 'UPDATE': return `Submit a ${edibleType.value.toLowerCase()}`
		case 'SUBMIT': return `Submit another ${edibleType.value.toLowerCase()}`
	}
});

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
			.filter(n => n.amount > 0)
	);

	return nutrients;
};

function stopScanning() {
	barcodeRef.value?.stopScanning();
}

function resetAllForms() {
	baseFormRef.value?.reset();
	nutrientsFormRef.value?.initForms();
	vitaminsFormRef.value?.initForms();
	mineralsFormRef.value?.initForms();
	barcodeRef.value?.clearBarcode();
	barcode.value = "";
};

watch(isNextEnabled, (wIsNextEnabled) => {
	emit('validation-change', wIsNextEnabled);
}, { immediate: true });

watch(requestForm, (wRequestForm) => {
	emit('req-change', wRequestForm);
}, { immediate: true });

watch(() => reqState, (wReqState) => {
	if (wReqState.isError) triggerSubmitErrorTimed();
});

defineExpose({ resetAllForms, stopScanning });
</script>

<template>
	<div class="flex flex-col gap-y-0">
		<div
			v-show="isContentVisible"
			class="overflow-y-scroll no-scrollbar pb-5 flex flex-col gap-y-4"
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
				ref="baseFormRef"
				v-show="currentStep === 1"
				:initial-values="initialEdible?.edible.information.base"
				@validation-change="isBaseFormValid = $event"
				@set="baseForm = $event"
			/>
			
			<NutrientsForm
				ref="nutrientsFormRef"
				v-show="currentStep === 2"
				nutrient-type="BASIC"
				:initial-values="initialNutrients"
				:should-require-any="edibleType === 'FOOD'"
				@validation-change="isNutrientsFormValid = $event"
				@set="nutrientsForm = $event"
			/>
			
			<NutrientsForm
				ref="vitaminsFormRef"
				v-show="currentStep === 3"
				nutrient-type="VITAMIN"
				:initial-values="initialVitamins"
				:should-require-any="false"
				@validation-change="isVitaminsFormValid = $event"
				@set="vitaminsForm = $event"
			/>
			
			<NutrientsForm
				ref="mineralsFormRef"
				v-show="currentStep === 4"
				nutrient-type="MINERAL"
				:initial-values="initialMinerals"
				:should-require-any="false"
				@validation-change="isMineralsFormValid = $event"
				@set="mineralsForm = $event"
			/>
			
			<EdibleBarcodeField
				ref="barcodeRef"
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
			:label="startOverLabel"
			@click="emit('start-over')"
			background-color="#088f8f"
		/>
	</div>
</template>
