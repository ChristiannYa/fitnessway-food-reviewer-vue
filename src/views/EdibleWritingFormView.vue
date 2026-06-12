<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit-form/header/SubmissionHeader.vue";
import { computed, useTemplateRef } from "vue";
import { useSubmitMutation, useUpdateMutation } from "@/hooks/mutations/foodMutations";
import EdibleWritePopup from "@/components/view/submit-form/form/EdibleWritePopup.vue";
import EdibleForms from "@/components/view/submit-form/form/EdibleForms.vue";
import type { RequestState } from "@/types/appTypes";
import { stringToTitleCase } from "@/utils/textUtils";
import { useEdibleWriteForm } from "@/hooks/composables/useEdibleWriteForm";
import { useRoute } from "vue-router";
import { useAdminSubmissionsState } from "@/hooks/composables/useAdminSubmissionsState";
import type { AppEdibleData, WriteType } from "@/types/foodTypes";
import BackgrundBlur from "@/components/shared/BackgrundBlur.vue";
import { getAppEdibleByIdQuery } from "@/hooks/queries/edibleQueries";
import { useQuery } from "@tanstack/vue-query";
import Spinner from "@/components/shared/Spinner.vue";

const edibleFormsRef = useTemplateRef('edibleFormsRef');

const route = useRoute();
const edibleIdPathParam = computed(() => route.params.edibleId as string | undefined);

const { accumulatedSubmissions } = useAdminSubmissionsState();
const edibleFromMemory = computed(() => accumulatedSubmissions.value.find(s => s.edible.id === Number(edibleIdPathParam.value)));

const { getOptions: getAppEdibleByIdQueryOpts } = getAppEdibleByIdQuery();
const getAppEdibleByIdQueryOptsCmpt = computed(() => ({
	...getAppEdibleByIdQueryOpts(Number(edibleIdPathParam.value)),
	enabled: !!edibleIdPathParam.value && !edibleFromMemory.value
}));
const { 
	data: edibleByIdRes,
	isLoading: isEdibleByIdLoading
 } = useQuery(getAppEdibleByIdQueryOptsCmpt);

const initialEdible = computed((): AppEdibleData | undefined => {
    if (!edibleIdPathParam.value) return undefined;

    return edibleFromMemory.value 
		?? edibleByIdRes.value?.data?.appEdible 
		?? undefined;
});

const writeType = computed((): WriteType => {
	if (initialEdible.value) return "UPDATE";
	return "SUBMIT";
});

const { 
	currentStep,
	finalNutrientsByType,
	request,
	isNextEnabled,
	wantsToWrite,
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
    const isSubmit = writeType.value === "SUBMIT";

    return ({
        isIdle: isSubmit 
			? isSubmitIdle.value 
			: isUpdateIdle.value,

        isLoading: isSubmit 
			? isSubmitPending.value : 
			isUpdatePending.value,

        isSuccess: isSubmit 
            ? submissionData.value?.success === true 
            : updateData.value?.success === true,
			
        isError: isSubmit 
            ? (isSubmitError.value || submissionData.value?.success === false)
            : (isUpdateError.value || updateData.value?.success === false)
    });
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

async function onWriteLocal() {
	onWrite(() => {
		const req = request.value;
		if (req === null) return;

		if (writeType.value === "SUBMIT") {
			mutateSubmit(req);
		} else {
			mutateUpdate(req);
		};
	});
};

function onStartOverLocal() {
	onStartOver(() => {
		if (writeType.value === "SUBMIT") {
			resetSubmitMutation();
		} else {
			resetUpdateMutation();
		};
	});
};
</script>

<template>
	<View class="relative">
		<div 
			v-if="!isEdibleByIdLoading"
			class="view-child-w flex flex-col grow h-full gap-4"
		>
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

		<Spinner 
			v-if="isEdibleByIdLoading"
			class="mx-auto"
		/>

		<BackgrundBlur 
			:is-visible="wantsToWrite && request !== null" 
			@click="wantsToWrite = false"
		/>

		<EdibleWritePopup
			v-if="wantsToWrite && request !== null"
			:edible-type="request.edibleRequest.edibleType"
			:edible-base="request.edibleRequest.base"
			:nutrients-by-type="finalNutrientsByType!"
			:barcode="request.barcode"
			:write-type="writeType"
			@cancel="wantsToWrite = false"
			@write="onWriteLocal"
		/>
	</View>
</template>
