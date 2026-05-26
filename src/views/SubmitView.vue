<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit/header/SubmissionHeader.vue";
import { ref } from "vue";

const currentStep = ref(1);

function onPrev() {
	if (currentStep.value > 1) currentStep.value--;
};

function onNext() {
	switch (currentStep.value) {
		case 5: {
			console.log("Submitting form")
			return
		};
		default: {
			currentStep.value++
			return
		};
	};
};
</script>

<template>
	<View>
		<SubmissionHeader 
			:current-step="currentStep"
			@prev="onPrev" 
			@next="onNext"
		/>
	</View>
</template>