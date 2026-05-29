<script setup lang="ts">
import { watch } from 'vue';
import { Percent } from 'lucide-vue-next';

const props = defineProps<{
	isActive: boolean;
	isClickable: boolean;
	dv: number;
}>();

const emit = defineEmits<{
	click: [];
}>();

watch(() => props.isActive, () => {
	const log = (l: string) => console.log(`[NutrientDvButton, watch(isActive)] ${l}`)
	log(`${props.isActive}`)
}, { immediate: true });

watch(() => props.dv, () => {
	const log = (l: string) => console.log(`[NutrientDvButton, watch(dv)] ${l}`)
	log(`${props.dv}`);
}, { immediate: true });
</script>

<template>
	<div class="flex gap-x-2">
		<div
			class="border border-smoke rounded-full w-16 my-1.5 flex flex-col 
				   items-end justify-center relative"
			:class="[
				isClickable 
					? 'cursor-pointer' 
					: 'cursor-default'
			]"
			@click="() => { if (isClickable) emit('click') }"
		>
			<span
				class="rounded-full h-3/4 aspect-square -translate-y-1/2 transition-transform
				       flex items-center justify-center absolute top-1/2"
				:class="[
					isActive
						? 'bg-chalk -translate-x-1.5'
						: 'bg-smoke -translate-x-8'
				]"
			>
				<Percent 
					:size="16"
					:stroke-width="2"
					class="transition-colors"
					:class="[
						isActive 
							? 'text-smoke'
							: 'text-chalk/60'
					]"
				/>
			</span>
			<div 
				v-if="isActive" 
				class="bg-dark-primary border-2 border-smoke rounded-full cursor-default 
						 h-6.5 min-w-6.5
						 flex items-center justify-center p-1 absolute -bottom-7.5 -right-3.5"
				@click.stop
			>
				<p class="text-cyan-500 font-bold opacity-80 my-auto text-sm leading-[1.1]">
					{{ dv }}
				</p>
			</div>
		</div>
	</div>
</template>