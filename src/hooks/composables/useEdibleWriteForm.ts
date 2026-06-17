import type { AppEdibleWriteReq } from "@/types/foodTypes";
import type { NutrientDataAmount, NutrientsByType } from "@/types/nutrientTypes";
import { computed, ref, type ShallowRef } from "vue";
import { buildNutrientList, buildNutrientsByTypeFromList } from "@/builders/nutrientBuilders";
import type { ComponentExposed } from 'vue-component-type-helpers';
import type EdibleForms from "@/components/view/submit-form/form/EdibleForms.vue";
import { getNutrientDataAmountsFromIds } from "@/utils/nutrientUtils";
import { useNutrientsByTypeQuery } from "../queries/nutrientQueries";

type FormsRef = Readonly<ShallowRef<ComponentExposed<typeof EdibleForms> | null>>;

export const useEdibleWriteForm = (edibleFormsRef: FormsRef) => {
	const currentStep = ref(1);
	const wantsToWrite = ref(false);
	const isNextEnabled = ref(false);

	const request = ref<AppEdibleWriteReq | null>(null);
	const { data: nutrientsByTypeRes } = useNutrientsByTypeQuery();

	const finalNutrientsByType = computed((): NutrientsByType<NutrientDataAmount> | null => {
		if (request === null) return null;

		const finalBareNutrientList = request?.value?.edibleRequest?.nutrients
		if (finalBareNutrientList === undefined) return null;

		const finalNutrientList = (() => {
			const apiNutrients = nutrientsByTypeRes.value?.data?.nutrientsByType;
			if (!apiNutrients) return null;

			return getNutrientDataAmountsFromIds(
				finalBareNutrientList, 
				buildNutrientList(apiNutrients)
			);
		})();
		if (finalNutrientList === null) return null;
		
		return buildNutrientsByTypeFromList(finalNutrientList, (n) => n.data.base.type);
	});

	async function onWrite(mutateFn: () => void) {
		if (request.value === null) return;
		wantsToWrite.value = false;
		mutateFn();
	};

	function onPrev() {
		if (currentStep.value > 1) currentStep.value--;
	};

	function onNext() {
		if (currentStep.value === 5) {
			wantsToWrite.value = true;
			edibleFormsRef?.value?.stopScanning();
		} else {
			currentStep.value++;
		}
	};

	function onStartOver(mutateResetFn: () => void) {
		currentStep.value = 1;
		mutateResetFn();
		edibleFormsRef.value?.resetAllForms();
	};

	return {
		currentStep,
		finalNutrientsByType,
		request,
		isNextEnabled,
		wantsToWrite,
		onWrite,
		onPrev,
		onNext,
		onStartOver
	};
};
