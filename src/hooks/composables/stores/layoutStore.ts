import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
	const headerHeight = ref(0);

	function setHeaderHeight(height: number) {
		headerHeight.value = height;
	};

	return { 
		headerHeight, 
		setHeaderHeight 
	};
});