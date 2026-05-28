import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccessTokenStore = defineStore("accessToken", () => {
	const accessToken = ref<string | null>(null);

	const set = (token: string) => accessToken.value = token;
	const clear = () => accessToken.value = null;

	return { accessToken, set, clear };
});
