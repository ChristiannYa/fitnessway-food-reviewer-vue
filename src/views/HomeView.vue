<script setup lang="ts">
import ByUserId from '@/components/foods/pending/search/ByUserId.vue';
import StatusFilter from '@/components/home/StatusFilter.vue';
import UserSearchScope from '@/components/home/UserSearchScope.vue';
import type { PendingFoodStatus } from '@/types/foodTypes';
import type { UserSearchScope as TUserSearchScope } from '@/types/userTypes';
import { ref } from 'vue';

const userSearchScope = ref<TUserSearchScope | null>(null) 
const pendingFoodStatus = ref<PendingFoodStatus | null>(null)
</script>

<template>
    <div class="min-h-screen flex flex-col items-center pt-10 px-4">
        <div class="max-w-164 w-full mx-auto">
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
    </div>
</template>
