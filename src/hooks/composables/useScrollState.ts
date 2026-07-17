import type { AppEdibleData } from "@/types/foodTypes";
import { ref } from "vue";

export class ScrollState<T> {
    accumulatedItems = ref<T[]>([]);
    offset = ref(0);
    hasMore = ref(true);
    scrollTop = ref(0);

    reset = () => {
        this.accumulatedItems.value = [];
        this.offset.value = 0;
        this.hasMore.value = true;
        this.scrollTop.value = 0;
    };
};

export const useAdminSubmissionsScrollState = () => new ScrollState<AppEdibleData>();
export const useReportsScrollState = () => new ScrollState<AppEdibleData>();

