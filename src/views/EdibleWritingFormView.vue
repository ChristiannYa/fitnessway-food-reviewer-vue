<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit-form/header/SubmissionHeader.vue";
import { computed, useTemplateRef } from "vue";
import { useSubmitMutation, useUpdateMutation } from "@/hooks/mutations/foodMutations";
import EdibleSubmitConfirmationPopup from "@/components/view/submit-form/form/EdibleSubmitConfirmationPopup.vue";
import EdibleForms from "@/components/view/submit-form/form/EdibleForms.vue";
import type { RequestState } from "@/types/appTypes";
import { stringToTitleCase } from "@/utils/textUtils";
import { useEdibleWriteForm } from "@/hooks/composables/useEdibleWriteForm";
import { useRoute } from "vue-router";
import { useAdminSubmissionsState } from "@/hooks/composables/useAdminSubmissionsState";

const edibleFormsRef = useTemplateRef('edibleFormsRef');

const route = useRoute();
const edibleId = computed(() => route.params.edibleId as string | undefined);

const { accumulatedSubmissions } = useAdminSubmissionsState();
const initialEdible = computed(() => 
	accumulatedSubmissions.value.find(s => s.edible.id === Number(edibleId.value)) ?? undefined
)
const writeType = computed((): "submit" | "update" => {
	if (initialEdible.value) return "update";
	return "submit";
});

const { 
	currentStep,
	finalNutrientsByType,
	request,
	isNextEnabled,
	wantsToWrite: wantsToSubmit,
	onWrite,
	onPrev,
	onNext,
	onStartOver,
 } = useEdibleWriteForm(edibleFormsRef);

const { 
	mutate: mutateSubmit, 
	isPending: isSubmitPending,
	isError: isSubmitError,
	isIdle: isSubmitIdle,
	reset: resetSubmitMutation,
	data: submissionData,
} = useSubmitMutation();

const {
	mutate: mutateUpdate,
	isPending: isUpdatePending,
	isError: isUpdateError,
	isIdle: isUpdateIdle,
	reset: resetUpdateMutation,
	data: updateData
} = useUpdateMutation();

const reqState = computed((): RequestState => {
	return ({
		isIdle: isSubmitIdle.value || 
				isUpdateIdle.value,

		isLoading: isSubmitPending.value || 
				   isUpdatePending.value,

		isSuccess: submissionData.value?.success === true || 
				   updateData.value?.success === true,

		isError: (isSubmitError.value || (submissionData.value?.success === false)) ||
				 (isUpdateError.value || (updateData.value?.success === false))
	})
});

const visibleSubmissionError = computed((): string | null => {
	if (!reqState.value.isError) return null;

	const res = submissionData?.value;
	if (res === undefined) return null;

	if (res.status === 409) return stringToTitleCase(res.message);

	const req = request.value;
	if (req === undefined) return null;

	return `Failed to ${writeType.value} ${req?.edibleRequest.edibleType.toLowerCase()}`
});

async function onSubmit() {
	onWrite(() => {
		const req = request.value;
		if (req === null) return;

		if (writeType.value === "submit") {
			mutateSubmit(req);
		} else {
			mutateUpdate(req);
		};
	});
};

function onStartOverLocal() {
	onStartOver(() => {
		if (writeType.value === "submit") {
			resetSubmitMutation();
		} else {
			resetUpdateMutation();
		};
	});
};
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
				ref="edibleFormsRef"
				:current-step="currentStep"
				:req-state="reqState"
				:visible-submission-error="visibleSubmissionError"
				:initial-edible="initialEdible"
				@req-change="request = $event"
				@validation-change="isNextEnabled = $event"
				@start-over="onStartOverLocal"
				class="min-h-0"
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
