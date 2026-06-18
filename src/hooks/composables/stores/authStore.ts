import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
	const isLoading = ref(true);

	function setIsLoading(is: boolean) {
		isLoading.value = is;
	};

	return { isLoading, setIsLoading };
});
