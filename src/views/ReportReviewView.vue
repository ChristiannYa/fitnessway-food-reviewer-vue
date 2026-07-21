<script setup lang="ts">
import EdiblePreviewBanner1 from "@/components/foods/EdiblePreviewBanner1.vue";
import BackgrundBlur from "@/components/shared/BackgrundBlur.vue";
import Spinner from "@/components/shared/Spinner.vue";
import View from "@/components/shared/View.vue";
import { getReportsQuery } from "@/hooks/queries/edibleQueries";
import { reportsScrollState } from "@/state/scrollState";
import type { RequestState } from "@/types/appTypes";
import type { AppEdibleData, AppEdibleReport } from "@/types/foodTypes";
import { getReportStatusUi } from "@/utils/foodUtils";
import { stringArrToText } from "@/utils/textUtils";
import { useQuery } from "@tanstack/vue-query";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const wantsToReview = ref(false);
const clickedEdible = ref<AppEdibleData | null>(null);
const clickedReport = ref<AppEdibleReport | null>(null);
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
        return { ...getOptions({ offset: offset.value, status: "PENDING" }) };
    }),
);

const ediblesReqState = computed(
    (): RequestState => ({
        isLoading: isEdiblesPending.value || isEdiblesFetching.value,
        isSuccess: ediblesRes.value?.success === true,
        isError: isEdiblesError.value || ediblesRes.value?.success === false,
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

function onClickReport(report: AppEdibleReport) {
    // prettier-ignore
    clickedReport.value = clickedReport.value === null 
        ? (clickedReport.value = report) 
        : null;
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

        <div
            v-if="wantsToReview && clickedEdible !== null"
            class="action-popup"
        >
            <div>
                <p>{{ clickedEdible.edible.information.base.name }}</p>
                <p class="text-sm text-smoke">Reports</p>
            </div>

            <div
                v-for="report in clickedEdible.reports"
                @click="onClickReport(report)"
                class="bg-smoke/10 rounded-md cursor-pointer border border-transparent hover:border-smoke p-2"
            >
                <p
                    :style="{
                        color: getReportStatusUi(report.status).hex,
                    }"
                    class="leading-tight"
                >
                    {{ report.status }}
                </p>
                <p>{{ stringArrToText(report.reasons) }}</p>
                <p
                    v-if="
                        clickedReport !== null &&
                        clickedReport.id === report.id &&
                        !!report.notes
                    "
                    class="text-smoke"
                >
                    {{ report.notes }}
                </p>
            </div>
        </div>
    </View>
</template>
