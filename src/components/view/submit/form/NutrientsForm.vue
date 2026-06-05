<script setup lang="ts">
import { buildNutrientListsByType } from '@/builders/nutrientBuilders';
import { useFormValidation, type FieldData, type FormValidation } from '@/hooks/composables/formValidation';
import { useNutrientsByTypeQuery } from '@/hooks/queries/nutrientQueries';
import { buildNutrientSchema, type NutrientSchema } from '@/schemas/NutrientSchema';
import type { NutrientData, NutrientType } from '@/types/nutrientTypes';
import { computed, reactive, ref, watch } from 'vue';
import EdibleFormField from './EdibleFormField.vue';
import Spinner from '@/components/shared/Spinner.vue';
import NutrientDvButton from './NutrientDvButton.vue';
import { getNutrientDv } from '@/utils/nutrientUtils.ts';
import { nutrientDvArray } from '@/constants/nutrientConstants.ts';

type FieldEntry = {
	nutrient: NutrientData,
	fieldData: FieldData
}

const {
	nutrientType,
	shouldRequireAny,
} = defineProps<{
	nutrientType: NutrientType,
	shouldRequireAny: boolean,
}>();

const emit = defineEmits<{
	'validation-change': [isValid: boolean];
	'set': [form: NutrientSchema];
}>();

const dvForm = reactive<NutrientSchema>({});
const dvActive = reactive<Record<string, boolean>>({});

function toggleActiveDv(id: number) {
	const key = String(id);
	dvActive[key] = !dvActive[key];
};

const shouldShowDvButton = (id: number) => 
	(nutrientDvArray as readonly number[]).includes(id)

const getDv = (id: number, amount: number) => 
	parseFloat(getNutrientDv(id, amount, "DV_TO_UNIT").toFixed(4));

const { 
	data, 
	isLoading, 
	isError 
} = useNutrientsByTypeQuery();

const nutrients = computed((): NutrientData[] | null => {
	const list = data?.value?.data?.nutrientsByType;
	if (list === undefined) return null;

	return buildNutrientListsByType(list, nutrientType);
});

const form = reactive<NutrientSchema>({});
const formValidation = ref<FormValidation | null>(null);
const fieldEntries = computed((): FieldEntry[] | null => {
	const validation = formValidation.value
	if (nutrients.value === null || validation === null) return null;

	return nutrients.value.map(n => ({
		nutrient: n,
		fieldData: validation.buildFieldData(
			n.base.name, 
			"0",
			"number",
			dvActive[String(n.base.id)]
				? "DV%"
				: n.base.unit.toLowerCase()
		)
	})) 
})

const isValid = computed(() => formValidation.value?.isValid ?? false);
const focusedFields = computed(() => formValidation.value?.focusedFields ?? {});

function initForms() {
	const nutrientsCopy = nutrients.value;
	if (nutrientsCopy === null) return;

	nutrientsCopy.forEach(nutrient => {
		const id = String(nutrient.base.id);

		form[id] = 0;
		dvForm[id] = 0;
		dvActive[id] = false;
	});
};

// Handle initial form seedings upon component mount
watch(nutrients, (wNutrients) => {
	if (wNutrients === null) return;

	initForms()
	
	formValidation.value =  useFormValidation(
		buildNutrientSchema(wNutrients, shouldRequireAny),
		form
	);
}, { immediate: true });

watch(form, (f) => {
	Object
		.entries(f)
		.forEach(([id, amount]) => {
			const amountNum = Number(amount);

			if (amountNum === 0 && dvActive[id]) {
				dvActive[id] = false;
				return;
			}

			const dv = dvActive[id] 
				? getDv(Number(id), amountNum)
				: amountNum;

			dvForm[id] = dv
		});

	emit('set', { ...dvForm });
}, { deep: true });

watch(dvActive, (da, prev) => {
	if (prev === undefined) return;

	Object
		.entries(da)
		.forEach(([id, isActive]) => {

			const amount = Number(form[id]);
			const dv = isActive 
				? getDv(Number(id), amount)
				: amount;

			dvForm[id] = dv
		});

	emit('set', { ...dvForm });
}, { deep: true, immediate: true });

watch(isValid, (iv) => emit('validation-change', iv), { immediate: true });

defineExpose({ initForms })
</script>

<template>
	<div class="flex flex-col items-center">
		<Spinner v-if="isLoading"/>

		<p v-if="isError" class="text-red-500">Error loading nutrients</p>

		<div 
			v-if="nutrients !== null"
			class="flex flex-col gap-y-5 w-full"
		>
			<EdibleFormField
				v-for="entry in fieldEntries"
				:key="entry.nutrient.base.id"
				v-model="form[String(entry.nutrient.base.id)]"
				:input-data="entry.fieldData.field"
				:is-focused="focusedFields[entry.nutrient.base.name.toLowerCase()] === true"
				:error-message="undefined"
				@reset="entry.fieldData.deleteError"
			>
				<NutrientDvButton 
					v-if="shouldShowDvButton(entry.nutrient.base.id)"
					:isActive="dvActive[String(entry.nutrient.base.id)]"
					:is-clickable="form[String(entry.nutrient.base.id)] > 0"
					:dv="dvForm[String(entry.nutrient.base.id)]"
					@click="() => toggleActiveDv(entry.nutrient.base.id)"
				/>
			</EdibleFormField>
		</div>
	</div>
</template>
