import type { AppEdibleWriteReq } from "@/types/foodTypes";
import type { NutrientDataAmount, NutrientsByType } from "@/types/nutrientTypes";
import { computed, ref, type ShallowRef } from "vue";
import { buildNutrientListFromType, buildNutrientsByTypeFromList } from "@/builders/nutrientBuilders";
import { useNutrientsByTypeQuery } from "../queries/nutrientQueries";
import type { ComponentExposed } from 'vue-component-type-helpers';
import type EdibleForms from "@/components/view/submit-form/form/EdibleForms.vue";

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
		
		const appNutrientsByType = nutrientsByTypeRes.value?.data?.nutrientsByType;
		if (appNutrientsByType === undefined) return null;
		const appNutrientList = buildNutrientListFromType(appNutrientsByType);
		
		const finalNutrientList = finalBareNutrientList.flatMap((bareNutrient): NutrientDataAmount[] => {
			const nutrientData = appNutrientList.find((appNutrient) => 
				appNutrient.base.id === bareNutrient.id
			)

			return nutrientData
				? bareNutrient.amount > 0 
					? [{
						data: nutrientData,
						amount: bareNutrient.amount
					}]
					: []
				: []
		})
		
		const nutrientsByType = buildNutrientsByTypeFromList(
			finalNutrientList, 
			(n) => n.data.base.type
		)
		
		return nutrientsByType;
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
