<script setup lang="ts">
import { buildNutrientListTyped } from "@/builders/nutrientBuilders";
import View from "@/components/shared/View.vue";
import { useNutrientsByTypeQuery } from "@/hooks/queries/nutrientQueries";
import { computed } from "vue";

const {
	data: nResData,
	isPending: nIsPending,
	isEnabled: nIsError,
} = useNutrientsByTypeQuery();

const nutrientListTyped = computed(() => {
	const nutrients = nResData?.value?.data?.nutrients;
	if (nutrients) return buildNutrientListTyped(nutrients);
});
</script>

<template>
	<View>
		<h1>Submision screen</h1>

		<div v-if="nutrientListTyped && nutrientListTyped?.length > 0">
			<div 
				v-for="nutrientList in nutrientListTyped"
				:key="nutrientList.type"
			>
				<p>{{ nutrientList.type }}</p>

				<div class="space-y-2">
					<p 
						v-for="nutrient in nutrientList.nutrients"
						:key="nutrient.base.id"
					>
						{{ nutrient.base.name }}
					</p>
				</div>
			</div>
		</div>
	</View>
</template>