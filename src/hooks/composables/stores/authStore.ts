import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
	const isAuthLoading = ref(true);

	function setIsAuthLoading(is: boolean) {
		isAuthLoading.value = is;
	};

	return { isAuthLoading, setIsAuthLoading };
});