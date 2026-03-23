import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccessTokenStore = defineStore("accessToken", () => {
	const accessToken = ref<string | null>(null);

	function save(token: string) {
		accessToken.value = token;
	}

	function clear() {
		accessToken.value = null;
	}

	return { accessToken, save, clear };
});
