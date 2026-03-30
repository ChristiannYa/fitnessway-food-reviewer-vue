<script setup lang="ts">
import PagesCount from '@/components/elements/PagesCount.vue';
import Spinner from '@/components/elements/Spinner.vue';
import { pagination } from '@/constants/pagination';
import { usePendingFoodsByUserIdQuery } from '@/hooks/queries/foodQueries';
import type { PendingFood, PendingFoodsReqParams, PendingFoodStatus } from '@/types/foodTypes';
import { isStringNullOrEmpty } from '@/utils/textUtils';
import { computed, reactive, ref, watch } from 'vue';
import Grid from '@/components/foods/pending/Grid.vue';
import Full from '@/components/foods/pending/information/Full.vue';
import { useReviewMutation } from '@/hooks/mutations/foodMutations';
import ProgressLine from '@/components/elements/ProgressLine.vue';
import ui from '@/constants/ui';
import { useQueryClient } from '@tanstack/vue-query';
import { queryKeys } from '@/constants/queryKeys';

const {
    pendingFoodStatus
} = defineProps<{
    pendingFoodStatus: PendingFoodStatus | null
}>()

const queryClient = useQueryClient()

const userIdInput = ref("")
const foodToReview = ref<PendingFood | null>(null)
const searchFailed = ref(false)

const params: PendingFoodsReqParams = reactive({
    userId: "",
    status: undefined,
    offset: 0
})

const reviewMutation = useReviewMutation()

const {
    isError: pfResIsError,
    isFetching: pfResIsFetching,
    data: pfResData,
    refetch: pfResRefetch
} = usePendingFoodsByUserIdQuery(params, { 
    enabled: false, 
})

let errorTimeout: ReturnType<typeof setTimeout> | null = null

watch([pfResIsError, pfResData, pfResIsFetching], () => {
    const isApiError = pfResData.value && !pfResData.value.success
    searchFailed.value = !pfResIsFetching.value && (pfResIsError.value || !!isApiError)

    if (searchFailed.value) {
        if (errorTimeout) clearTimeout(errorTimeout)
        errorTimeout = setTimeout(() => 
            searchFailed.value = false, ui.errorDurationMs
        )
    }
})

function handleSearch() {
    queryClient.removeQueries({
        queryKey: queryKeys.food.pending.byUserIdAll()
    })

    params.userId = userIdInput.value
    params.offset = 0
    params.status = pendingFoodStatus ?? undefined

    pfResRefetch()
}

function handlePageChange(p: number) {
    params.offset = (p - 1) * pagination.limit

    const cache = queryClient.getQueryData(queryKeys.food.pending.byUserId(params))
    if (!cache) pfResRefetch()
}

const queryData = computed(() => pfResData.value?.data?.pendingFoodsPagination)
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-4 mx-auto w-full sm:w-3/5">
            <input 
                type="text" 
                name="userId" 
                id="userId"
                placeholder="User ID"
                v-model="userIdInput"
                class="px-3 py-2 text-center border border-smoke focus:ring-1 
                       focus:ring-dry-green focus:outline-0"
            />
            <button
                @click="handleSearch"
                :disabled="isStringNullOrEmpty(userIdInput)"
                class="py-2 rounded-4xl bg-smoke text-mist cursor-pointer
                       transition-colors disabled:opacity-20 disabled:cursor-default"
            >
                Search
            </button>
        </div>

        <div v-if="searchFailed" class="flex flex-col gap-1 w-fit mx-auto">
            <p class="text-red-400 text-center leading-tight">
                Error fetching foods by User ID
            </p>
            <ProgressLine 
                :duration="ui.errorDurationMs" 
                :bg-color="'f87171'" 
            />
        </div>


        <Spinner v-if="pfResIsFetching" :size="16" class="mx-auto"/>

        <div v-if="queryData && !pfResIsFetching">
            <PagesCount
                :page-count="queryData.pageCount"
                :current-page="queryData.currentPage"
                @page-change="handlePageChange"
            />
            <Grid
                :pending-foods="queryData.data"
                :user-search-scope="'ID'"
                @pending-food-click="(f) => foodToReview = f"
                :class="[queryData.pageCount > 0 ? 'mt-4' : '']"
            />
        </div>

        <div 
            v-if="foodToReview"
            @click="foodToReview = null"
            class="fixed inset-0 flex items-center justify-center bg-black/40
                   backdrop-blur-md z-20"
        >
            <div @click.stop class="flex justify-center w-full mx-4 sm:w-90">
                <Full
                    :pending-food="foodToReview"
                    :user-search-scope="'ID'"
                    @review="(req) => reviewMutation.mutate(req)"
                    class="w-full"
                />
            </div>
        </div>
    </div>
</template>