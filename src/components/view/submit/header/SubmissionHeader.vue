<script setup lang="ts">
import { ref, computed } from "vue";
import StepIndicator from "./StepIndicator.vue";
import StepControlButtons from "./StepControlButtons.vue";

type StepData = {
	title: string;
	prevStepLabel?: string;
	nextStepLabel: string;
}

const currentStep = ref(1);

const stepData = computed((): StepData | null => {
	const stepTitle1 = "Information";
	const stepTitle2 = "Nutrients";
	const stepTitle3 = "Vitamins";
	const stepTitle4 = "Minerals";
	const stepTitle5 = "Barcode"

	switch (currentStep.value) {
		case 1: return {
			title: stepTitle1,
			prevStepLabel: undefined,
			nextStepLabel: stepTitle2,
		};
		case 2: return {
			title: stepTitle2,
			prevStepLabel: stepTitle1,
			nextStepLabel: stepTitle3,
		};
		case 3: return {
			title: stepTitle3,
			prevStepLabel: stepTitle2,
			nextStepLabel: stepTitle4,
		}
		case 4: return {
			title: stepTitle4,
			prevStepLabel: stepTitle3,
			nextStepLabel: stepTitle5,
		}
		case 5: return {
			title: stepTitle5,
			prevStepLabel: stepTitle4,
			nextStepLabel: "Submit",
		}
		default: return null;
	}
});

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
	<div 
		v-if="stepData !== null"
		class="w-100"
	>
		<div class="flex flex-col items-center gap-4">
			<!-- Step Title -->
			<p class="font-bold text-2xl">
				{{ stepData.title }}
			</p>
			
			<!-- Current step indicator -->
			<StepIndicator 
				:amount="5" 
				:current="currentStep" 
				class="w-full flex gap-2"
			/>

			<!-- Step Control Buttons -->
			<StepControlButtons
				:current="currentStep"
				:prev-step-label="stepData.prevStepLabel"
				:next-step-label="stepData.nextStepLabel"
				@prev="onPrev"
				@next="onNext"
				class="w-full flex justify-between gap-x-4"
			/>
		</div>
	</div>
</template>