<script setup lang="ts">
import EdiblePreviewBanner1 from "@/components/foods/EdiblePreviewBanner1.vue";
import BackgrundBlur from "@/components/shared/BackgrundBlur.vue";
import Spinner from "@/components/shared/Spinner.vue";
import View from "@/components/shared/View.vue";
import EdibleWithReports from "@/components/view/reports-review/EdibleWithReports.vue";
import { getReportsQuery } from "@/hooks/queries/edibleQueries";
import { reportsScrollState } from "@/state/scrollState";
import type { RequestState } from "@/types/appTypes";
import type { AppEdibleData } from "@/types/foodTypes";
import { useQuery } from "@tanstack/vue-query";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const wantsToReview = ref(false);
const clickedEdible = ref<AppEdibleData | null>(null);
const scrollRef = ref<HTMLElement | null>(null);

const {
    accumulatedItems: accumulatedEdibles,
    offset,
    isEndReached: isEndReachedST,
    handleAcc,
    onMount,
    onUnmount,
} = reportsScrollState;

const {
    data: ediblesRes,
    isPending: isEdiblesPending,
    isFetching: isEdiblesFetching,
    isError: isEdiblesError,
} = useQuery(
    computed(() => {
        const { getOptions } = getReportsQuery();
        return {
            ...getOptions({ offset: offset.value, status: "PENDING" }),
        };
    }),
);

const ediblesReqState = computed(
    (): RequestState => ({
        isLoading: isEdiblesPending.value || isEdiblesFetching.value,
        isSuccess: ediblesRes.value?.success === true,
        isError:
            isEdiblesError.value || ediblesRes.value?.success === false,
    }),
);

const isEndReached = computed((): boolean => {
    const total = ediblesRes.value?.data?.appEdibleReports.totalCount;
    return !!total && isEndReachedST(total);
});

function onEdibleClick(edible: AppEdibleData) {
    wantsToReview.value = true;
    clickedEdible.value = edible;
}

onMounted(() => {
    onMount(scrollRef.value, () => ediblesReqState.value.isLoading);
});
onUnmounted(onUnmount);

watch(
    ediblesReqState,
    (wediblesReqState) => {
        if (!wediblesReqState.isSuccess) return;
        const edibles = ediblesRes.value!.data!.appEdibleReports.data;
        handleAcc(edibles);
    },
    { immediate: true },
);
</script>

<template>
    <View>
        <div class="view-child-w w-full flex flex-col relative">
            <p
                v-if="ediblesReqState.isSuccess"
                class="text-center text-smoke"
            >
                Total:
                <span class="font-bold font-mono">
                    {{ ediblesRes?.data?.appEdibleReports?.totalCount }}
                </span>
            </p>

            <div
                ref="scrollRef"
                class="h-full overflow-y-scroll no-scrollbar pt-3.5 pb-2 flex flex-col gap-y-4"
            >
                <EdiblePreviewBanner1
                    v-for="report in accumulatedEdibles"
                    :key="report.edible.id"
                    :edible-data="report"
                    :is-report-count-visible="true"
                    @click="onEdibleClick(report)"
                />

                <p
                    v-if="isEndReached"
                    class="text-chalk text-center opacity-60 pb-2"
                >
                    You've reached the end
                </p>
            </div>

            <Spinner
                v-show="ediblesReqState.isLoading"
                :size="32"
                class="absolute left-1/2 -translate-1/2 bg-accent-primary rounded-full p-1.5"
                :class="[
                    accumulatedEdibles.length > 0
                        ? 'bottom-0'
                        : 'top-1/2 -translate-1/2',
                ]"
            />

            <p
                v-if="ediblesReqState.isError"
                class="text-center text-red-500 w-full absolute top-0 left-1/2 -translate-x-1/2"
            >
                Failed to load reports
            </p>
        </div>

        <BackgrundBlur
            :is-visible="wantsToReview"
            @click="wantsToReview = false"
        />

        <EdibleWithReports
            v-if="clickedEdible !== null && wantsToReview"
            :edible-data="clickedEdible"
        />
    </View>
</template>
