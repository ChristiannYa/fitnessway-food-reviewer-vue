<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit/header/SubmissionHeader.vue";
import { computed, ref } from "vue";
import EdibleBaseForm from "@/components/view/submit/form/EdibleBaseForm.vue";
import type { EdibleBaseSchema } from "@/schemas/EdibleBaseSchema";
import type { NutrientSchema } from "@/schemas/NutrientSchema";
import NutrientsForm from "@/components/view/submit/form/NutrientsForm.vue";
import EdibleBarcodeField from "@/components/view/submit/form/EdibleBarcodeField.vue";
import { isBarcodeValid as uIsBarcodeValid } from "@/utils/textUtils";
import { useSubmitMutation } from "@/hooks/mutations/foodMutations";
import Spinner from "@/components/shared/Spinner.vue";
import type { NutrientIdWithAmount } from "@/types/nutrientTypes";
import { EDIBLE_TYPE, type AppEdibleSubmitReq, type EdibleType } from "@/types/foodTypes";
import EdibleRadio from "@/components/view/submit/form/EdibleRadio.vue";

const { 
	mutate: submitMutation, 
	isPending: isSubmitPending,
	isSuccess: isSubmitSucces,
	isError: isSubmitError,
	isIdle: isSubmitIdle,
	data: submissionData,
} = useSubmitMutation()

const currentStep = ref(1);

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
	switch (currentStep.value) {
		case 1: return isBaseFormValid.value;
		case 2: return isNutrientsFormValid.value;
		case 3: return isVitaminsFormValid.value;
		case 4: return isMineralsFormValid.value;
		case 5: return isBarcodeValid.value;
		default: return false;
	};
});

async function onSubmit() {
	if (baseForm.value === null ||
		nutrientsForm.value === null ||
		vitaminsForm.value === null ||
		mineralsForm.value === null
	) return;

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
	)

	const request: AppEdibleSubmitReq = {
		edibleRequest: {
			base: baseForm.value,
			nutrients: nutrients,
			edibleType: edibleType.value
		},
		barcode: barcode.value
	} 

	submitMutation(request)
};

function onPrev() {
	if (currentStep.value > 1) currentStep.value--;
};

function onNext() {
	switch (currentStep.value) {
		case 5: {
			onSubmit();
			return;
		};
		default: {
			currentStep.value++
			return;
		};
	};
};
</script>

<template>
	<View>
		<div class="view-child-w flex flex-col grow h-full gap-4">
			<EdibleRadio
				v-model="edibleType"
				:values="EDIBLE_TYPE"
			/>

			<SubmissionHeader 
				:current-step="currentStep"
				:isNextDisabled="!isNextEnabled"
				@prev="onPrev" 
				@next="onNext"
			/>

			<div 
				:class="[
					currentStep >= 2 
						? 'overflow-y-scroll no-scrollbar pb-5' 
						: ''
					]
				"
				@wheel="(e) => {
					if (currentStep >= 2) {
						// Allows proper usage of the scroll wheel when modifying
						// the amount values with it
						e.stopImmediatePropagation();
					}
				}"
			>
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
					v-show="currentStep === 5 && isSubmitIdle"
					v-model="barcode"
				/>
			</div>

			<Spinner v-if="isSubmitPending" class="mx-auto"/>

			<p 
				v-if="isSubmitError || (isSubmitSucces && !submissionData?.success)" 
				class="text-red-500 text-center"
			>
				Failed to submit edible
			</p>

			<p v-if="submissionData?.success" class="text-center">
				Submission Successfull
			</p>
		</div>
	</View>
</template>
