<script setup lang="ts">
import type { PendingFood } from "@/types/foodTypes";
import type { UserSearchScope } from "@/types/userTypes";
import Summary from "./Summary.vue";

defineProps<{
    pendingFoods: PendingFood[];
    userSearchScope: UserSearchScope
}>()

const emit = defineEmits<{
    pendingFoodClick: [food: PendingFood]
}>()
</script>

<template>
    <p v-if="pendingFoods.length === 0" class="text-center">
        No foods available
    </p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <div v-for="pendingFood in pendingFoods" :key="pendingFood.id">
            <Summary
                :pending-food="pendingFood"
                :user-search-scope="userSearchScope"
                @click="emit('pendingFoodClick', pendingFood)"
            />
        </div>
    </div>
</template>