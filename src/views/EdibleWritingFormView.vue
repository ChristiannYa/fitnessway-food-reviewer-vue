<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit-form/header/SubmissionHeader.vue";
import { computed, useTemplateRef, watch } from "vue";
import { useSubmitMutation, useUpdateMutation } from "@/hooks/mutations/foodMutations";
import EdibleWritePopup from "@/components/view/submit-form/form/EdibleWritePopup.vue";
import EdibleForms from "@/components/view/submit-form/form/EdibleForms.vue";
import type { RequestState } from "@/types/appTypes";
import { stringToTitleCase } from "@/utils/textUtils";
import { useEdibleWriteForm } from "@/hooks/composables/useEdibleWriteForm";
import { useRoute, useRouter } from "vue-router";
import { useAdminSubmissionsState } from "@/hooks/composables/useAdminSubmissionsState";
import type { AppEdibleData, WriteType } from "@/types/foodTypes";
import { getAppEdibleByIdQuery } from "@/hooks/queries/edibleQueries";
import { useQuery } from "@tanstack/vue-query";
import WriteFormTopbar from "@/components/view/submit-form/WriteFormTopbar.vue";
import BackgrundBlur from "@/components/shared/BackgrundBlur.vue";
import Spinner from "@/components/shared/Spinner.vue";
import FindByBarcodePopup from "@/components/view/submit-form/FindByBarcodePopup.vue";

const edibleFormsRef = useTemplateRef("edibleFormsRef");
const findByBarcodePopupRef = useTemplateRef("findByBarcodePopupRef");

const route = useRoute();
const router = useRouter();

const edibleIdPathParam = computed(() => route.params.edibleId as string | undefined);

const { accumulatedSubmissions } = useAdminSubmissionsState();
const edibleFromMemory = computed(() => accumulatedSubmissions.value.find(s => s.edible.id === Number(edibleIdPathParam.value)));

const { 
	data: edibleByIdRes,
	isLoading: isEdibleByIdLoading
 } = useQuery(computed(() => {
	const { getOptions } = getAppEdibleByIdQuery();
	return ({
		...getOptions(Number(edibleIdPathParam.value)),
		enabled: !!edibleIdPathParam.value && !edibleFromMemory.value
	});
}));

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
} = useUpdateMutation(edibleIdPathParam.value ?? "0");

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

	return `Failed to ${writeType.value.toLowerCase()} ${req?.edibleRequest.edibleType.toLowerCase()}`
});


watch(edibleByIdRes, (wedibleByIdRes) => {
	if (!wedibleByIdRes?.data?.appEdible) {
		router.push("/submission/write-form");
	};
});

async function onWriteLocal() {
	onWrite(() => {
		const req = request.value;
		if (req === null) return;

		switch (writeType.value) {
			case "UPDATE": mutateUpdate(req); return;
			case "SUBMIT": mutateSubmit(req); return;
		}
	});
};

function onStartOverLocal() {
	onStartOver(() => {
		switch(writeType.value) {
			case "UPDATE": {
				resetUpdateMutation();
				router.push("/submission/write-form")
				return;
			};
			case "SUBMIT": resetSubmitMutation(); return;
		}
	});
};
</script>

<template>
	<View class="relative">
		<div 
			v-if="!isEdibleByIdLoading"
			class="view-child-w flex flex-col grow h-full gap-4 relative"
		>
			<WriteFormTopbar 
				v-if="currentStep === 1"
				:write-type="writeType" 
				@scan="findByBarcodePopupRef?.onWantsToScan"
				class="mb-4"
			/>

			<SubmissionHeader 
				v-if="!reqState.isSuccess"
				:current-step="currentStep"
				:write-type="writeType"
				:isWriting="reqState.isLoading"
				:isNextDisabled="!isNextEnabled"
				@prev="onPrev" 
				@next="onNext"
			/>

			<EdibleForms
				ref="edibleFormsRef"
				:current-step="currentStep"
				:req-state="reqState"
				:visible-submission-error="visibleSubmissionError"
				:write-type="writeType"
				:initial-edible="initialEdible"
				@req-change="request = $event"
				@validation-change="isNextEnabled = $event"
				@start-over="onStartOverLocal"
				class="min-h-0"
			/>
		</div>
		
		<FindByBarcodePopup ref="findByBarcodePopupRef" />

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
