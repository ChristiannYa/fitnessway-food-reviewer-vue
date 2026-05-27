<script setup lang="ts">
import View from "@/components/shared/View.vue";
import SubmissionHeader from "@/components/view/submit/header/SubmissionHeader.vue";
import { computed, reactive, ref } from "vue";
import { buildEdibleBaseSchema, type EdibleBaseSchema } from "@/schemas/EdibleBaseSchema";
import EdibleBaseFormField from "@/components/view/submit/form/EdibleBaseFormField.vue";
import type { InputField } from "@/types/appTypes";
import EdibleBaseServingUnitRadio from "@/components/view/submit/form/EdibleBaseServingUnitRadio.vue";

type BaseSchemaPartial<T> = Partial<Record<keyof EdibleBaseSchema, T>>

const currentStep = ref(1);

const baseForm = reactive<EdibleBaseSchema>({
	name: "",
	brand: "",
	servingUnit: "G",
	amountPerServing: 0
});

const focusedFields = reactive<BaseSchemaPartial<boolean>>({});
const errorFields = reactive<BaseSchemaPartial<string>>({});
const touchedFields = reactive<BaseSchemaPartial<boolean>>({});

const nameFieldData: InputField = {
	label: "Name",
	type: "text",
	placeholder: "Organic Hemp Seeds",
	onFocus: () => { focusedFields.name = true },
	onBlur: () => { 
		focusedFields.name = false; 
		touchedFields.name = true;
	}
};

const brandFieldData: InputField = {
	label: "Brand",
	type: "text",
	placeholder: "Kirkland Signature",
	onFocus: () => { focusedFields.brand = true },
	onBlur: () => { 
		focusedFields.brand = false;
		touchedFields.brand = true;
	}
};

const amountPerServingFieldData: InputField = {
	label: "Amount per serving",
	type: "number",
	placeholder: "60",
	onFocus: () => { focusedFields.amountPerServing = true },
	onBlur: () => { 
		focusedFields.amountPerServing = false;
		touchedFields.servingUnit = true;
	}
};

const isStep1Valid = computed(() => {
	const result = buildEdibleBaseSchema().safeParse(baseForm);

	if (!result.success) {
		result.error.issues.forEach(issue => {
			const key = issue.path[0] as keyof EdibleBaseSchema;
			errorFields[key] = issue.message;
		});
		return false;
	};

	return true
})

async function onSubmit() {
	console.log("Submitting form");
	console.log(JSON.stringify(baseForm, null, 2));
};

function onPrev() {
	if (currentStep.value > 1) currentStep.value--;
};

function onNext() {
	if (currentStep.value === 1) { 
		console.log(JSON.stringify(baseForm, null, 2)) 
	};

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
						:input-data="nameFieldData"
						:is-focused="focusedFields.name === true"
						:errorMessage="undefined"
						@reset="delete errorFields.name"
					/>
					<EdibleBaseFormField
						v-model="baseForm.brand"
						:input-data="brandFieldData"
						:is-focused="focusedFields.brand === true"
						:errorMessage="undefined"
						@reset="delete errorFields.brand"
					/>
					<EdibleBaseFormField
						v-model="baseForm.amountPerServing"
						:input-data="amountPerServingFieldData"
						:is-focused="focusedFields.amountPerServing === true"
						:errorMessage="undefined"
						@reset="delete errorFields.amountPerServing"
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