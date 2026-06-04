import ui from "@/constants/ui";
import { onUnmounted, ref } from "vue";

export function useErrorTimeout(duration: number = ui.errorDurationMs) {
	const isError = ref(false);
	let timeout: ReturnType<typeof setTimeout> | null = null;

	function triggerError() {
		if (timeout) clearTimeout(timeout);
		isError.value = true;
		timeout = setTimeout(() => {
			isError.value = false;
		}, duration);
	};

	function clearError() {
		if (timeout) clearTimeout(timeout);
		isError.value = false;
	};

	onUnmounted(clearError);

	return { 
		isError,
		triggerError,
		clearError
	 }
};
