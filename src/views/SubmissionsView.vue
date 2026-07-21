<script setup lang="ts">
import View from "@/components/shared/View.vue";
import { getAdminSubmissionsQuery } from "@/hooks/queries/edibleQueries";
import type { RequestState } from "@/types/appTypes";
import { useQuery } from "@tanstack/vue-query";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Spinner from "@/components/shared/Spinner.vue";
import EdibleWritePopup from "@/components/view/submit-form/form/EdibleWritePopup.vue";
import type { AppEdibleData } from "@/types/foodTypes";
import BackgrundBlur from "@/components/shared/BackgrundBlur.vue";
import { useRouter } from "vue-router";
import { adminSubmissionsScrollState } from "@/state/scrollState";
import EdiblePreviewBanner1 from "@/components/foods/EdiblePreviewBanner1.vue";

const router = useRouter();

const wantsToUpdate = ref(false);
const clickedEdible = ref<AppEdibleData | null>(null);
const scrollRef = ref<HTMLElement | null>(null);

const {
    accumulatedItems: accumulatedSubmissions,
    offset,
    isEndReached,
    handleAcc,
    onMount,
    onUnmount,
} = adminSubmissionsScrollState;

const {
    data: adminSubmissionsRes,
    isPending: isAdminSubmissionsPending,
    isFetching: isAdminSubmissionsFetching,
    isError: isAdminSubmissionsError,
} = useQuery(
    computed(() => {
        const { getOptions } = getAdminSubmissionsQuery();
        return { ...getOptions({ offset: offset.value }) };
    }),
);

const adminSubissionsReqState = computed(
    (): RequestState => ({
        isLoading:
            isAdminSubmissionsPending.value || isAdminSubmissionsFetching.value,
        isSuccess: adminSubmissionsRes.value?.success === true,
        isError:
            isAdminSubmissionsError.value ||
            adminSubmissionsRes.value?.success === false,
    }),
);

const endReached = computed((): boolean => {
    const total =
        adminSubmissionsRes.value?.data?.submittedAppEdibles.totalCount;
    return !!total && isEndReached(total);
});

function onEdibleClick(edible: AppEdibleData) {
    wantsToUpdate.value = true;
    clickedEdible.value = edible;
}

function onWrite() {
    if (clickedEdible.value === null) return;
    router.push(`/submission/write-form/${clickedEdible.value.edible.id}`);
}

onMounted(() => {
    onMount(scrollRef.value, () => adminSubissionsReqState.value.isLoading);
});
onUnmounted(onUnmount);

watch(
    adminSubissionsReqState,
    (wAdminSubissionsReqState) => {
        if (!wAdminSubissionsReqState.isSuccess) return;
        const items = adminSubmissionsRes.value!.data!.submittedAppEdibles.data;
        handleAcc(items);
    },
    { immediate: true },
);
</script>

<template>
    <View>
        <div class="view-child-w h-full flex flex-col relative">
            <p
                v-if="adminSubissionsReqState.isSuccess"
                class="text-center text-smoke"
            >
                Total:
                <span class="font-bold font-mono">
                    {{
                        adminSubmissionsRes?.data?.submittedAppEdibles
                            ?.totalCount
                    }}
                </span>
            </p>

            <div
                ref="scrollRef"
                class="h-full overflow-y-scroll no-scrollbar pt-3.5 pb-2 flex flex-col gap-y-4"
            >
                <EdiblePreviewBanner1
                    v-for="submission in accumulatedSubmissions"
                    :key="submission.edible.id"
                    :edible-data="submission"
                    @click="onEdibleClick(submission)"
                />

                <p
                    v-if="endReached"
                    class="text-chalk text-center opacity-60 pb-2"
                >
                    You've reached the end
                </p>
            </div>

            <Spinner
                v-show="adminSubissionsReqState.isLoading"
                :size="32"
                class="absolute left-1/2 -translate-x-1/2 bg-accent-primary rounded-full p-1.5"
                :class="[
                    accumulatedSubmissions.length > 0
                        ? 'bottom-2'
                        : 'top-1/2 -translate-y-1/2',
                ]"
            />

            <p
                v-if="adminSubissionsReqState.isError"
                class="text-center text-red-500 w-full absolute top-0 left-1/2 -translate-x-1/2"
            >
                Failed to load submissions
            </p>
        </div>

        <BackgrundBlur
            :is-visible="wantsToUpdate && clickedEdible !== null"
            @click="wantsToUpdate = false"
        />

        <EdibleWritePopup
            v-if="wantsToUpdate && clickedEdible !== null"
            :edible-type="clickedEdible.edible.information.type"
            :edible-base="clickedEdible.edible.information.base"
            :nutrients-by-type="clickedEdible.edible.information.nutrients"
            :barcode="clickedEdible.barcode"
            :write-type="'UPDATE'"
            @cancel="wantsToUpdate = false"
            @write="onWrite"
        />
    </View>
</template>
