<script setup lang="ts">
import type { PendingFood, PendingFoodReviewReq } from '@/types/foodTypes';
import type { UserSearchScope } from '@/types/userTypes';
import { ref } from 'vue';
import { isReviewed } from '@/utils/foodUtils';
import ActionButton from '@/components/shared/ActionButton.vue';
import { Check, X } from 'lucide-vue-next';
import ReviewData from './ReviewData.vue';
import { buildPendingFoodReview } from '@/builders/foodBuilders';
import RejectionWriting from '@/components/view/review/RejectionWriting.vue';
import EdibleOverview from '../../EdibleOverview.vue';
import PendingEdibleOverviewHeader from './PendingEdibleOverviewHeader.vue';

const {
    pendingFood,
    userSearchScope
} = defineProps<{
    pendingFood: PendingFood
    userSearchScope: UserSearchScope
}>()

const emit = defineEmits<{
    review: [req: PendingFoodReviewReq]
}>()

const isRejecting = ref(false)
const isReviewInfoVisible = ref(false)

function handleApproval() {
    emit('review', {
        pendingFoodId: pendingFood.id,
        rejectionReason: null
    })
}

function handleRejection(reason: string) {
    emit('review', {
        pendingFoodId: pendingFood.id,
        rejectionReason: reason
    })

    isRejecting.value = false
}
</script>

<template>
    <div class="flex flex-col bg-smoke/40 rounded-xl relative overflow-hidden">
        <PendingEdibleOverviewHeader
            :pending-food="pendingFood"
            @view-review="isReviewInfoVisible = true"
        />

		<EdibleOverview 
			:edible-base="pendingFood.information.base" 
			:nutrients-by-type="pendingFood.information.nutrients"
		/>

        <div
            v-if="!isRejecting && !isReviewed(pendingFood.status)"
            class="flex w-full pb-4 px-4 gap-2"
        >
            <ActionButton
                label="Approve"
                :icon="Check"
                backgroundColor="bg-accent-primary"
                @click="handleApproval"
            />
            <ActionButton
                label="Reject"
                :icon="X"
                backgroundColor="bg-rose-600"
                @click="isRejecting = true"
            />
        </div>

        <p 
            v-if="userSearchScope === 'Type'"
            class="pb-4 px-4 text-center text-sm opacity-70"
        >
            {{ pendingFood.createdBy }}
        </p>

        <ReviewData
            v-if="isReviewInfoVisible"
            :review="buildPendingFoodReview(pendingFood)"
            @close="isReviewInfoVisible = false"
        />

        <RejectionWriting
            v-if="isRejecting"
            @cancel="isRejecting = false"
            @reject="handleRejection"
            class="absolute w-full h-full"
        />
    </div>
</template>