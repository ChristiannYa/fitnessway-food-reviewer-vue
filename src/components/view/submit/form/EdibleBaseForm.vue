<script setup lang="ts">
import { reactive, watch } from 'vue';
import { buildEdibleBaseSchema, type EdibleBaseSchema } from "@/schemas/EdibleBaseSchema";
import { useFormValidation } from '@/hooks/composables/formValidation';
import EdibleBaseServingUnitRadio from './EdibleBaseServingUnitRadio.vue';
import EdibleFormField from './EdibleFormField.vue';

const emit = defineEmits<{
	'validation-change': [isValid: boolean];
	'set': [form: EdibleBaseSchema];
}>();

const form = reactive<EdibleBaseSchema>({
	name: "",
	brand: "",
	servingUnit: "G",
	amountPerServing: 0
});

const { 
	focusedFields,
	errorFields,
	isValid,
	buildFieldData
} = useFormValidation(buildEdibleBaseSchema(), form);

const nameFieldData = buildFieldData("Name", "Organic Hemp Seeds", "text");
const brandFieldData = buildFieldData("Brand", "Kirkland Signature", "text");
const amountPerServingFieldData = buildFieldData("Amount per serving", "60", "number");

watch(isValid, (iv) => emit('validation-change', iv), { immediate: true })
watch(form, (f) => emit('set', { ...f }), { deep: true });
</script>

<template>
	<div class="flex flex-col flex-1 gap-y-4">
		<EdibleFormField
			v-model="form.name"
			:input-data="nameFieldData.field"
			:is-focused="focusedFields['name'] === true"
			:error-message="undefined"
			@reset="nameFieldData.deleteError"
		/>
		<EdibleFormField
			v-model="form.brand"
			:input-data="brandFieldData.field"
			:is-focused="focusedFields['brand'] === true"
			:errorMessage="undefined"
			@reset="brandFieldData.deleteError"
		/>
		<EdibleFormField
			v-model="form.amountPerServing"
			:input-data="amountPerServingFieldData.field"
			:is-focused="focusedFields['amount per serving'] === true"
			:errorMessage="undefined"
			@reset="amountPerServingFieldData.deleteError"
		/>
		<EdibleBaseServingUnitRadio 
			v-model="form.servingUnit"
			:ref="errorFields.servingUnit"
		/>
	</div>
</template>
