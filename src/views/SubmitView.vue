<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit/header/SubmissionHeader.vue";
import { ref } from "vue";
import EdibleBaseForm from "@/components/view/submit/form/EdibleBaseForm.vue";
import type { EdibleBaseSchema } from "@/schemas/EdibleBaseSchema";

const currentStep = ref(1);

const isBaseFormValid = ref(false);

const baseForm = ref<EdibleBaseSchema | null>(null);

async function onSubmit() {
	console.log("Submitting form");
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
		<div class="flex flex-col gap-4">
			<SubmissionHeader 
				:current-step="currentStep"
				:isNextDisabled="!isBaseFormValid"
				@prev="onPrev" 
				@next="onNext"
			/>

			<EdibleBaseForm 
				v-show="currentStep === 1"
				@validation-change="isBaseFormValid = $event"
				@set="baseForm = $event"
			/>
		</div>
	</View>
</template>
