<script setup lang="ts">
import ByUserId from '@/components/review/search/ByUserId.vue';
import StatusFilter from '@/components/review/StatusFilter.vue';
import UserSearchScope from '@/components/review/UserSearchScope.vue';
import type { PendingFoodStatus } from '@/types/foodTypes';
import type { UserSearchScope as TUserSearchScope } from '@/types/userTypes';
import { ref } from 'vue';
import View from "@/components/shared/View.vue";

const userSearchScope = ref<TUserSearchScope | null>(null) 
const pendingFoodStatus = ref<PendingFoodStatus | null>(null)
</script>

<template>
    <View>
		<div class="max-w-164 w-full">
			<div class="flex flex-col items-center gap-2 w-full">
				<UserSearchScope
					:search-scope="userSearchScope"
					@select="(s) => userSearchScope = s === userSearchScope ? null : s"
				/>
				<StatusFilter
					:pending-food-status="pendingFoodStatus"
					@select="(s) => pendingFoodStatus = s === pendingFoodStatus ? null : s"
				/>
			</div>
			<ByUserId
				v-if="userSearchScope === 'ID'"
				:pending-food-status="pendingFoodStatus"
				class="mt-2"
			/>
		</div>
    </View>
</template>
