<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit/header/SubmissionHeader.vue";
import { reactive, ref } from "vue";
import { buildEdibleBaseSchema, type EdibleBaseSchema } from "@/schemas/EdibleBaseSchema";
import EdibleBaseFormField from "@/components/view/submit/form/EdibleBaseFormField.vue";
import EdibleBaseServingUnitRadio from "@/components/view/submit/form/EdibleBaseServingUnitRadio.vue";
import { useFormValidation } from "@/hooks/composables/formValidation";

const currentStep = ref(1);

const baseForm = reactive<EdibleBaseSchema>({
	name: "",
	brand: "",
	servingUnit: "G",
	amountPerServing: 0
});

const { 
	focusedFields,
	errorFields,
	isValid: isStep1Valid,
	buildFieldData
} = useFormValidation(buildEdibleBaseSchema(), baseForm);

const nameFieldData = buildFieldData("Name", "Organic Hemp Seeds", "text");
const brandFieldData = buildFieldData("Brand", "Kirkland Signature", "text");
const amountPerServingFieldData = buildFieldData("Amount per serving", "60", "number");

async function onSubmit() {
	console.log("Submitting form");
	console.log(JSON.stringify(baseForm, null, 2));
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
				:isNextDisabled="!isStep1Valid"
				@prev="onPrev" 
				@next="onNext"
			/>
	
			<div v-show="currentStep === 1">
				<form class="flex flex-col gap-y-4">
					<EdibleBaseFormField
						v-model="baseForm.name"
						:input-data="nameFieldData.field"
						:is-focused="focusedFields['name'] === true"
						:errorMessage="undefined"
						@reset="nameFieldData.deleteError"
					/>
					<EdibleBaseFormField
						v-model="baseForm.brand"
						:input-data="brandFieldData.field"
						:is-focused="focusedFields['brand'] === true"
						:errorMessage="undefined"
						@reset="brandFieldData.deleteError"
					/>
					<EdibleBaseFormField
						v-model="baseForm.amountPerServing"
						:input-data="amountPerServingFieldData.field"
						:is-focused="focusedFields['amount per serving'] === true"
						:errorMessage="undefined"
						@reset="amountPerServingFieldData.deleteError"
					/>
					<EdibleBaseServingUnitRadio 
						v-model="baseForm.servingUnit"
						:ref="errorFields.servingUnit"
					/>
				</form>
			</div>
		</div>
	</View>
</template>
