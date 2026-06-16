<script setup lang="ts">
import View from '@/components/shared/View.vue';
import { pagination } from '@/constants/pagination';
import { getAdminSubmissionsQuery } from '@/hooks/queries/edibleQueries';
import type { RequestState } from '@/types/appTypes';
import { useQuery } from '@tanstack/vue-query';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import Spinner from '@/components/shared/Spinner.vue';
import EdibleBase from '@/components/foods/EdibleBase.vue';
import { stringToIsoDate } from '@/utils/textUtils';
import { useAdminSubmissionsState } from '@/hooks/composables/useAdminSubmissionsState';
import EdibleWritePopup from '@/components/view/submit-form/form/EdibleWritePopup.vue';
import type { AppEdibleData } from '@/types/foodTypes';
import BackgrundBlur from '@/components/shared/BackgrundBlur.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const wantsToUpdate = ref(false);
const clickedEdible = ref<AppEdibleData | null>(null);
const scrollRef = ref<HTMLElement | null>(null);

const { 
	accumulatedSubmissions,
	offset,
	hasMore,
	scrollTop
 } = useAdminSubmissionsState();

const {
	data: adminSubmissionsRes,
	isPending: isAdminSubmissionsPending,
	isFetching: isAdminSubmissionsFetching,
	isError: isAdminSubmissionsError,
} = useQuery(computed(() => {
	const { getOptions } = getAdminSubmissionsQuery();
	return ({ ...getOptions({ offset: offset.value }) });
}));

const adminSubissionsReqState = computed((): RequestState => ({
	isLoading: isAdminSubmissionsPending.value || isAdminSubmissionsFetching.value,
	isSuccess: adminSubmissionsRes.value?.success === true,
	isError: isAdminSubmissionsError.value || (adminSubmissionsRes.value?.success === false)
}));

const endReached = computed(() => {
	const accLen = accumulatedSubmissions.value.length;
	const totalCount = adminSubmissionsRes?.value?.data?.submittedAppEdibles.totalCount;
	return !hasMore.value && accLen === totalCount;
});

function loadMore() {
	if (!adminSubissionsReqState.value.isLoading && hasMore.value) {
		offset.value += pagination.limit;
	}
};

function handleScroll() {
	const el = scrollRef.value;
	if (!el) return;

	scrollTop.value = el.scrollTop;

	const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
	if (isNearBottom) loadMore();
};

function onEdibleClick(edible: AppEdibleData) {
	wantsToUpdate.value = true;
	clickedEdible.value = edible;
};

function onWrite() {
	if (clickedEdible.value === null) return;
	router.push(`/submission/write-form/${clickedEdible.value.edible.id}`);
};

onMounted(() => { 
	scrollRef.value?.addEventListener("scroll", handleScroll);

	nextTick(() => {
		if (scrollRef.value) scrollRef.value.scrollTop = scrollTop.value;
	});
});

onUnmounted(() => { 
	scrollRef.value?.removeEventListener("scroll", handleScroll);
});

watch(adminSubissionsReqState, (wAdminSubissionsReqState) => {
	if (!wAdminSubissionsReqState.isSuccess) return;

	const items = adminSubmissionsRes.value!.data!.submittedAppEdibles.data;

	// Only push if this offset's items aren't already accumulated
	if (accumulatedSubmissions.value.length <= offset.value) {
		accumulatedSubmissions.value.push(...items);
	};

	if (items.length < pagination.limit) hasMore.value = false;
}, { immediate: true });

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
					{{ adminSubmissionsRes?.data?.submittedAppEdibles?.totalCount }} 
				</span>
			</p>

			<div 
				ref="scrollRef"
				class="h-full overflow-y-scroll no-scrollbar pt-3.5 pb-2 flex flex-col gap-y-4"
			>
				<div 
					v-for="submission in accumulatedSubmissions"
					:key="submission.edible.id"
					@click="onEdibleClick(submission)"
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
						: 'top-1/2 -translate-y-1/2'
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
			class=""
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
