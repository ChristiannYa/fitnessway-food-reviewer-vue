<script setup lang="ts">
import { useLayoutStore } from '@/hooks/composables/stores/layoutStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

type Props = {
	hasPadding?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	hasPadding: true 
})

const { headerHeight } = storeToRefs(useLayoutStore());

const headerHeightCss = computed(() => {
	const height = headerHeight.value;
	return `calc(100dvh - ${height}px)`;
});
</script>

<template>
	<div 
		class="w-full flex flex-col items-center"
		:class="[hasPadding ? 'pt-10 px-4' : '']"
		:style="{
			minHeight: headerHeightCss,
			height: headerHeightCss
		}"
	>
		<slot/>
	</div>
</template>
