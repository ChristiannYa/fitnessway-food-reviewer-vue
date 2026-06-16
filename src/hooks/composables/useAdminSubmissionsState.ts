import type { AppEdibleData } from "@/types/foodTypes";
import { ref } from "vue";

const accumulatedSubmissions = ref<AppEdibleData[]>([]);
const offset = ref(0);
const hasMore = ref(true);
const scrollTop = ref(0);
function reset() {
	accumulatedSubmissions.value = [];
	offset.value = 0;
	hasMore.value = true;
	scrollTop.value = 0;
}

export const useAdminSubmissionsState = () => ({
	accumulatedSubmissions,
	offset,
	hasMore,
	scrollTop,
	reset
});
