<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit/header/SubmissionHeader.vue";
import { computed, ref } from "vue";
import { useSubmitMutation } from "@/hooks/mutations/foodMutations";
import type { NutrientDataAmount, NutrientsByType } from "@/types/nutrientTypes";
import { type AppEdibleSubmitReq } from "@/types/foodTypes";
import EdibleSubmitConfirmationPopup from "@/components/view/submit/form/EdibleSubmitConfirmationPopup.vue";
import { buildNutrientListFromType, buildNutrientsByTypeFromList } from "@/builders/nutrientBuilders";
import { useNutrientsByTypeQuery } from "@/hooks/queries/nutrientQueries";
import EdibleForms from "@/components/view/submit/form/EdibleForms.vue";
import type { RequestState } from "@/types/appTypes";
import { stringToTitleCase } from "@/utils/textUtils";

const { data: nbtRes } = useNutrientsByTypeQuery();

const { 
	mutate: submitMutate, 
	isPending: isSubmitPending,
	isError: isSubmitError,
	isIdle: isSubmitIdle,
	data: submissionData,
} = useSubmitMutation()

const currentStep = ref(1);

const wantsToSubmit = ref(false);
const isNextEnabled = ref(false);

const request = ref<AppEdibleSubmitReq | null>(null);

const finalNutrientsByType = computed((): NutrientsByType<NutrientDataAmount> | null => {
	if (request === null) return null;

	const finalBareNutrientList = request?.value?.edibleRequest?.nutrients
	if (finalBareNutrientList === undefined) return null;
	
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

const reqState = computed((): RequestState => {
	return ({
		isIdle: isSubmitIdle.value,
		isLoading: isSubmitPending.value,
		isSuccess: submissionData.value?.success === true,
		isError: isSubmitError.value || (submissionData.value?.success === false)
	})
});

const visibleSubmissionError = computed((): string | null => {
	if (!reqState.value.isError) return null;

	const res = submissionData?.value;
	if (res === undefined) return null;

	if (res.status === 409) return stringToTitleCase(res.message);

	const req = request.value;
	if (req === undefined) return null;

	return `Failed to submit ${req?.edibleRequest.edibleType.toLowerCase()}`
});

async function onSubmit() {
	if (request.value === null) return;
	wantsToSubmit.value = false;
	submitMutate(request.value);
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

function onStartOver() {
	currentStep.value = 1;
}
</script>

<template>
	<View class="relative">
		<div class="view-child-w flex flex-col grow h-full gap-4 z-1">
			<SubmissionHeader 
				v-if="!reqState.isSuccess"
				:current-step="currentStep"
				:is-submitting="isSubmitPending"
				:isNextDisabled="!isNextEnabled"
				@prev="onPrev" 
				@next="onNext"
			/>

			<EdibleForms
				:current-step="currentStep"
				:req-state="reqState"
				:visible-submission-error="visibleSubmissionError"
				@req-change="request = $event"
				@validation-change="isNextEnabled = $event"
				@start-over="onStartOver"
			/>
		</div>

		<EdibleSubmitConfirmationPopup
			v-if="wantsToSubmit && request"
			:edible-type="request.edibleRequest.edibleType"
			:edible-base="request.edibleRequest.base"
			:nutrients-by-type="finalNutrientsByType!"
			:barcode="request.barcode"
			class="bg-dark-secondary border border-accent-primary/60 rounded-lg 
			         transition-opacity overflow-y-hidden w-96 max-w-5/6 max-h-3/5 
					 absolute top-1/10"
			:class="[
				wantsToSubmit 
					? 'z-3'
					: 'z-0'
			]"
			@cancel="() => wantsToSubmit = false"
			@confirm="onSubmit"
		/>

		<div 
			class="w-full h-full absolute top-0 left-0"
			:class="[
				wantsToSubmit 
					? 'bg-dark-tertiary/60 backdrop-blur-xs z-2'
					: 'z-0'
			]"
		/>
	</View>
</template>
