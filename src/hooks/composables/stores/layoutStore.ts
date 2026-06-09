import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
	const headerHeight = ref(0);

	const screenHeightCssPxString = computed((): string => {
		const height = headerHeight.value;
		return `calc(100dvh - ${height}px)`;
	})

	function setHeaderHeight(height: number) {
		headerHeight.value = height;
	};

	return { 
		headerHeight: readonly(headerHeight), 
		screenHeightCssPxString,
		setHeaderHeight,
	};
});