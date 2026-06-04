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
import type { NutrientDataAmount, NutrientIdWithAmount, NutrientsByType } from "@/types/nutrientTypes";
import { EDIBLE_TYPE, type EdibleType } from "@/types/foodTypes";
import EdibleRadio from "@/components/view/submit/form/EdibleRadio.vue";
import EdibleSubmitConfirmationPopup from "@/components/view/submit/form/EdibleSubmitConfirmationPopup.vue";
import { buildNutrientListFromType, buildNutrientsByTypeFromList } from "@/builders/nutrientBuilders";
import { useNutrientsByTypeQuery } from "@/hooks/queries/nutrientQueries";

const { data: nbtRes } = useNutrientsByTypeQuery();

const { 
	mutate: submitMutation, 
	isPending: isSubmitPending,
	isSuccess: isSubmitSucces,
	isError: isSubmitError,
	isIdle: isSubmitIdle,
	data: submissionData,
} = useSubmitMutation()

const currentStep = ref(1);
const wantsToSubmit = ref(false);

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

const finalNutrientsByType = computed((): NutrientsByType<NutrientDataAmount> | null => {
	const finalBareNutrientList = getFinalNutrientListOrNull();
	if (finalBareNutrientList === null) return null;
	
	const appNutrientsByType = nbtRes.value?.data?.nutrientsByType;
	if (appNutrientsByType === undefined) return null;
	const appNutrientList = buildNutrientListFromType(appNutrientsByType);
	
	const finalNutrientList = finalBareNutrientList.flatMap((bareNutrient): NutrientDataAmount[] => {
		const nutrientData = appNutrientList.find((appNutrient) => 
			appNutrient.base.id === bareNutrient.id
		)

		return nutrientData
			? bareNutrient.amount > 0 
				? [{
					data: nutrientData,
					amount: bareNutrient.amount
				}]
				: []
			: []
	})
	
	const nutrientsByType = buildNutrientsByTypeFromList(
		finalNutrientList, 
		(n) => n.data.base.type
	)
	
	return nutrientsByType;
})

const isConfirmationPopupVisible = computed((): boolean => {
	return wantsToSubmit.value &&
		   baseForm !== null &&
		   finalNutrientsByType !== null
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

async function onSubmit() {
	const nutrients = getFinalNutrientListOrNull();

	if (baseForm.value === null || nutrients === null) return;

	submitMutation({
		edibleRequest: {
			base: baseForm.value,
			nutrients: nutrients,
			edibleType: edibleType.value
		},
		barcode: barcode.value
	});

	wantsToSubmit.value = false;
};

function onPrev() {
	if (currentStep.value > 1) currentStep.value--;
};

function onNext() {
	if (currentStep.value === 5) {
		wantsToSubmit.value = true;
	} else {
		currentStep.value++;
	}
};
</script>

<template>
	<View class="relative">
		<div class="view-child-w flex flex-col grow h-full gap-4 z-1">
			<EdibleRadio
				v-model="edibleType"
				:values="EDIBLE_TYPE"
			/>

			<SubmissionHeader 
				:current-step="currentStep"
				:is-submitting="isSubmitPending"
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

		<EdibleSubmitConfirmationPopup
			v-if="isConfirmationPopupVisible"
			:edible-type="edibleType"
			:edible-base="baseForm!"
			:nutrients-by-type="finalNutrientsByType!"
			class="bg-dark-secondary border border-accent-primary/60 rounded-lg 
			         transition-opacity overflow-y-hidden w-96 max-w-5/6 max-h-3/5 
					 absolute top-1/10"
			:class="[
				isConfirmationPopupVisible 
					? 'z-3'
					: 'z-0'
			]"
			@cancel="() => wantsToSubmit = false"
			@confirm="onSubmit"
		/>

		<div 
			class="w-full h-full absolute top-0 left-0"
			:class="[
				isConfirmationPopupVisible 
					? 'bg-dark-tertiary/60 backdrop-blur-xs z-2'
					: 'z-0'
			]"
		/>
	</View>
</template>
