<script setup lang="ts">
import { reactive, watch } from 'vue';
import { buildEdibleBaseSchema, type EdibleBaseSchema } from "@/schemas/EdibleBaseSchema";
import { useFormValidation } from '@/hooks/composables/useFormValidation.ts';
import EdibleFormField from './EdibleFormField.vue';
import EdibleRadio from './EdibleRadio.vue';
import { SERVING_UNIT } from '@/types/foodTypes.ts';

const { initialValues } = defineProps<{
	initialValues?: EdibleBaseSchema;
}>();

const emit = defineEmits<{
	'validation-change': [isValid: boolean];
	'set': [form: EdibleBaseSchema];
}>();

const form = reactive<EdibleBaseSchema>(
	initialValues
		? { ...initialValues }
		: {
			name: "",
			brand: "",
			servingUnit: "G",
			amountPerServing: 0
		}
)

const { 
	focusedFields,
	errorFields,
	isValid,
	buildFieldData
} = useFormValidation(buildEdibleBaseSchema(), form);

const nameFieldData = buildFieldData("Name", "Organic Hemp Seeds", "text");
const brandFieldData = buildFieldData("Brand", "Kirkland Signature", "text");
const amountPerServingFieldData = buildFieldData("Amount per serving", "60", "number");

function reset() {
    form.name = initialValues?.name ?? "";
    form.brand = initialValues?.brand ?? "";
    form.servingUnit = initialValues?.servingUnit ?? "G";
    form.amountPerServing = initialValues?.amountPerServing ?? 0;
};

watch(isValid, (iv) => emit('validation-change', iv), { immediate: true });

watch(form, () => {
  const result = buildEdibleBaseSchema().safeParse(form);
  if (!result.success) return;
  emit('set', result.data);
}, { deep: true, immediate: true });

defineExpose({ reset });
</script>

<template>
	<div class="flex flex-col flex-1 gap-y-5">
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
		<EdibleRadio
			v-model="form.servingUnit"
			:values="SERVING_UNIT"
			:ref="errorFields.servingUnit"
		/>
	</div>
</template>
