
import { pagination } from "@/constants/pagination";
import type { AppEdibleData } from "@/types/foodTypes";
import { ref, nextTick, type Ref } from "vue";

export class ScrollState<T> {
    scrollRef: HTMLElement | null = null;

    accumulatedItems: Ref<T[]> = ref<T[]>([]) as Ref<T[]>;
    offset = ref(0);

    private hasMore = ref(true);
    private scrollTop = ref(0);

    private boundHandleScroll: (() => void) | null = null;

    isEndReached = (totalCount: number): boolean => {
        const acclen = this.accumulatedItems.value.length;
        return !this.hasMore.value && acclen === totalCount;
    };

    private loadMore = (isLoading: () => boolean) => {
        if (!isLoading() && this.hasMore.value) {
            this.offset.value += pagination.limit;
        }
    };

    handleScroll = (isLoading: () => boolean) => {
        const el = this.scrollRef;
        if (!el) return;
        this.scrollTop.value = el.scrollTop;
        const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
        if (isNearBottom) this.loadMore(isLoading);
    };

    handleAcc = (items: T[]) => {
        // Only push if this offset's items aren't already accumulated
        if (this.accumulatedItems.value.length <= this.offset.value) {
            this.accumulatedItems.value.push(...items);
        };
        if (items.length < pagination.limit) this.hasMore.value = false;
    };

    onMount = (el: HTMLElement | null, isLoading: () => boolean) => {
        this.scrollRef = el;
        this.boundHandleScroll = () => this.handleScroll(isLoading);
        this.scrollRef?.addEventListener("scroll", this.boundHandleScroll);
        nextTick(() => {
            if (this.scrollRef) this.scrollRef.scrollTop = this.scrollTop.value;
        });
    };

    onUnmount = () => {
        if (this.boundHandleScroll) {
            this.scrollRef?.removeEventListener("scroll", this.boundHandleScroll);
            this.boundHandleScroll = null;
        }
    };

    reset = () => {
        this.accumulatedItems.value = [];
        this.offset.value = 0;
        this.hasMore.value = true;
        this.scrollTop.value = 0;
    };
};

export const adminSubmissionsScrollState = new ScrollState<AppEdibleData>();
export const reportsScrollState = new ScrollState<AppEdibleData>();

