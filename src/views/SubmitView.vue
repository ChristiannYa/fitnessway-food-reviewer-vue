<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit/header/SubmissionHeader.vue";
import { computed, ref } from "vue";
import EdibleBaseForm from "@/components/view/submit/form/EdibleBaseForm.vue";
import type { EdibleBaseSchema } from "@/schemas/EdibleBaseSchema";
import type { NutrientSchema } from "@/schemas/NutrientSchema";
import NutrientsForm from "@/components/view/submit/form/NutrientsForm.vue";

const currentStep = ref(1);

const baseForm = ref<EdibleBaseSchema | null>(null);
const isBaseFormValid = ref(false);

const nutrientsForm = ref<NutrientSchema | null>(null);
const isNutrientsFormValid = ref(false);

const vitaminsForm = ref<NutrientSchema | null>(null);
const isVitaminsFormValid = ref(false);

const mineralsForm = ref<NutrientSchema | null>(null);
const isMineralsFormValid = ref(false);

const isNextEnabled = computed(() => {
	switch (currentStep.value) {
		case 1: return isBaseFormValid.value;
		case 2: return isNutrientsFormValid.value;
		case 3: return isVitaminsFormValid.value;
		case 4: return isMineralsFormValid.value;
		default: return false;
	};
});

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
				:isNextDisabled="!isNextEnabled"
				@prev="onPrev" 
				@next="onNext"
			/>

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
		</div>
	</View>
</template>
