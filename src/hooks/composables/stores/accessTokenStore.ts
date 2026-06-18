import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccessTokenStore = defineStore("accessToken", () => {
	const token = ref<string | null>(null);

	const set = (t: string) => token.value = t;
	const clear = () => token.value = null;

	return { token, set, clear };
});
