<script setup lang="ts">
import ActionButton from "@/components/shared/ActionButton.vue";
import { ref, computed } from "vue";
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next';

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

const steps = Array.from({ length: 5 }, (_, i) => i + 1);

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
			<div class="w-full flex gap-2">
				<span 
					v-for="step in steps"
					:class="[
						'border-3 border-accent-primary rounded-full flex-1',
						step <= currentStep 
							? 'opacity-100' 
							: 'opacity-10'
					]"
				/>
			</div>

			<!-- Step Control Buttons -->
			<div class="w-full flex justify-between gap-x-4">
				<ActionButton
					v-if="stepData.prevStepLabel"
					:label="stepData.prevStepLabel"
					:icon="ArrowLeft"
					:icon-size="16"
					background-color="var(--color-accent-primary)"
					:is-inverted="true"
					@click="onPrev"
					class="flex-1"
				/>
			
				<ActionButton
					:label="stepData.nextStepLabel"
					:icon="currentStep < 5 ? ArrowRight : Check"
					:icon-size="16"
					background-color="var(--color-accent-primary)"
					@click="onNext"
					class="flex-1"
				/>
			</div>
		</div>
	</div>
</template>