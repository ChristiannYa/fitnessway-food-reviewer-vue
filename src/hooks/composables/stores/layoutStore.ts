import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
	const headerHeight = ref(0);
	const viewBottomNavbarHeight = ref(0);

	const screenHeightCssPxString = computed((): string => {
		const height = headerHeight.value + viewBottomNavbarHeight.value;
		return `calc(100dvh - ${height}px)`;
	})

	function setHeaderHeight(height: number) {
		headerHeight.value = height;
	};

	function setViewBottomNavbarHeight(height: number) {
		viewBottomNavbarHeight.value = height;
	};

	return { 
		headerHeight: readonly(headerHeight), 
		viewBottomNavbarHeight: readonly(viewBottomNavbarHeight),
		screenHeightCssPxString,
		setHeaderHeight,
		setViewBottomNavbarHeight
	};
});