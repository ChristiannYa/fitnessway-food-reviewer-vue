<script setup lang="ts">
import { useLayoutStore } from '@/hooks/composables/stores/layoutStore';
import { storeToRefs } from 'pinia';

type Props = {
	hasPadding?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	hasPadding: true 
})

const { screenHeightCssPxString } = storeToRefs(useLayoutStore());
</script>

<template>
	<div 
		class="w-full flex flex-col items-center"
		:class="[
			hasPadding 
				? 'pt-6 lg:pt-10 px-4' 
				: ''
			]"
		:style="{
			minHeight: screenHeightCssPxString,
			height: screenHeightCssPxString
		}"
	>
		<slot/>
	</div>
</template>
