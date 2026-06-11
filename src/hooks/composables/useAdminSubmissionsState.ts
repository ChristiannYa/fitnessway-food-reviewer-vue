import type { AppEdibleData } from "@/types/foodTypes";
import { ref } from "vue";

const accumulatedSubmissions = ref<AppEdibleData[]>([]);
const offset = ref(0);
const hasMore = ref(true);
const scrollTop = ref(0);

export const useAdminSubmissionsState = () => ({
	accumulatedSubmissions,
	offset,
	hasMore,
	scrollTop
})
