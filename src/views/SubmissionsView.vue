<script setup lang="ts">
import View from '@/components/shared/View.vue';
import { pagination } from '@/constants/pagination';
import { getAdminSubmissionsQuery } from '@/hooks/queries/edibleQueries';
import type { RequestState } from '@/types/appTypes';
import type { AppEdibleData } from '@/types/foodTypes';
import { useQuery } from '@tanstack/vue-query';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import Spinner from '@/components/shared/Spinner.vue';
import EdibleBase from '@/components/foods/EdibleBase.vue';
import { stringToIsoDate } from '@/utils/textUtils';

const offset = ref(0);
const accumulatedSubmissions = ref<AppEdibleData[]>([]);
const scrollRef = ref<HTMLElement | null>(null);
const hasMore = ref(true);

const { getOptions: getAdminSubmissionsQueryOptions } = getAdminSubmissionsQuery();
const adminSubmmissionsQueryOptions = computed(() => getAdminSubmissionsQueryOptions({ offset: offset.value }));

const {
	data: adminSubmissionsRes,
	isPending: isAdminSubmissionsPending,
	isFetching: isAdminSubmissionsFetching,
	isError: isAdminSubmissionsError,
} = useQuery(adminSubmmissionsQueryOptions);

const adminSubissionsReqState = computed((): RequestState => ({
	isLoading: isAdminSubmissionsPending.value || isAdminSubmissionsFetching.value,
	isSuccess: adminSubmissionsRes.value?.success === true,
	isError: isAdminSubmissionsError.value || (adminSubmissionsRes.value?.success === false)
}))

function loadMore() {
	if (!adminSubissionsReqState.value.isLoading && hasMore.value) {
		offset.value += pagination.limit;
	}
};

function handleScroll() {
	const el = scrollRef.value;
	if (!el) return;

	const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
	if (isNearBottom) loadMore();
}

onMounted(() => { scrollRef.value?.addEventListener("scroll", handleScroll) });
onUnmounted(() => { scrollRef.value?.removeEventListener("scroll", handleScroll) });

watch(adminSubissionsReqState, (wAdminSubissionsReqState) => {
	if (!wAdminSubissionsReqState.isSuccess) return;

	const items = adminSubmissionsRes.value!.data!.submittedAppEdibles.data;
	accumulatedSubmissions.value.push(...items);
	if (items.length < pagination.limit) hasMore.value = false;
});

</script>

<template>
	<View>	
		<div class="view-child-w h-full relative">
			<div 
				ref="scrollRef"
				class="h-full overflow-y-scroll no-scrollbar pt-3.5 pb-2 flex flex-col gap-y-4"
			>
				<div 
					v-for="submission in accumulatedSubmissions"
					:key="submission.edible.id"
					class="bg-dark-tertiary border border-smoke/40 text-chalk rounded-md 
							 cursor-pointer hover:border-accent-primary transition-colors
							 p-3 relative"
				>
					<span class="bg-dark-primary border border-smoke/40 text-sm leading-none 
								   p-1 rounded-sm absolute -top-3.5 right-0">
						{{ stringToIsoDate(submission.edible.createdAt) }}
					</span>

					<EdibleBase :food-base="submission.edible.information.base" :is-name-clickable="false"/>
				</div>
				
				<p 
					v-if="!hasMore && accumulatedSubmissions.length === adminSubmissionsRes?.data?.submittedAppEdibles.totalCount"
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
						: 'top-8'
				]"
			/>

			<p v-if="adminSubissionsReqState.isError">Failed to load submissions</p>
		</div>
	</View>
</template>
