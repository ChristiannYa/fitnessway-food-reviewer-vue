<script setup lang="ts">
import { buildNutrientListByType } from '@/builders/nutrientBuilders';
import { useFormValidation, type FieldData, type FormValidation } from '@/hooks/composables/formValidation';
import { useNutrientsByTypeQuery } from '@/hooks/queries/nutrientQueries';
import { buildNutrientSchema, type NutrientSchema } from '@/schemas/NutrientSchema';
import type { NutrientData, NutrientType } from '@/types/nutrientTypes';
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import EdibleFormField from './EdibleFormField.vue';
import Spinner from '@/components/shared/Spinner.vue';

type FieldEntry = {
	nutrient: NutrientData,
	fieldData: FieldData
}

const {
	nutrientType,
	shouldRequireAny,
} = defineProps<{
	nutrientType: NutrientType,
	shouldRequireAny: boolean
}>();

const emit = defineEmits<{
	'validation-change': [isValid: boolean];
	'set': [form: NutrientSchema];
}>();

const fieldEntries = shallowRef<FieldEntry[] | null>(null);

const { 
	data, 
	isLoading, 
	isError 
} = useNutrientsByTypeQuery();

const nutrients = computed((): NutrientData[] | null => {
	const list = data?.value?.data?.nutrients;
	if (list === undefined) return null;

	return buildNutrientListByType(list, nutrientType);
});

const form = reactive<NutrientSchema>({});
const formValidation = ref<FormValidation | null>(null);

watch(nutrients, (ns) => {
	if (ns === null) return;

	ns.forEach(n => { form[n.base.id] = 0 });

	const validation = useFormValidation(buildNutrientSchema(ns, shouldRequireAny), form);
	formValidation.value =  validation;

	fieldEntries.value = ns.map(n => ({
		nutrient: n,
		fieldData: validation.buildFieldData(n.base.name, "0", "number", n.base.unit)
	}));

}, { immediate: true });

const isValid = computed(() => formValidation.value?.isValid ?? false);
const focusedFields = computed(() => formValidation.value?.focusedFields ?? {});

watch(isValid, (iv) => emit('validation-change', iv), { immediate: true });
watch(form, (f) => { emit('set', { ...f }) }, { deep: true });
</script>

<template>
	<div class="flex flex-col items-center">
		<Spinner v-if="isLoading"/>

		<p v-if="isError" class="text-red-500">Error loading nutrients</p>

		<div 
			v-if="nutrients !== null"
			class="flex flex-col gap-y-4"
		>
			<EdibleFormField
				v-for="entry in fieldEntries"
				:key="entry.nutrient.base.id"
				v-model="form[entry.nutrient.base.id]"
				:input-data="entry.fieldData.field"
				:is-focused="focusedFields[entry.nutrient.base.name] === true"
				:error-message="undefined"
				@reset="entry.fieldData.deleteError"
			/>
		</div>
	</div>
</template>
