<script setup lang="ts">
import { USER_SEARCH_SCOPE, type UserSearchScope } from '@/types/userTypes';
import ActionButton from '../elements/ActionButton.vue';

const { searchScope } = defineProps<{
    searchScope: UserSearchScope | null
}>()

const emit = defineEmits<{
    select: [scope: UserSearchScope]
}>()

const scopes = Object.values(USER_SEARCH_SCOPE)
const isSelected = (s: UserSearchScope) => s === searchScope
</script>

<template>
    <div 
        :style="{ 
            gridTemplateColumns: `repeat(${scopes.length}, 1fr)`
        }"
        class="grid gap-4"
    >
        <ActionButton
            v-for="scope in scopes"
            :key="scope"
            :label="scope"
            :bg-color="isSelected(scope) ? 'bg-accent-primary' : 'bg-smoke'"
            :is-active="isSelected(scope)"
            @click="emit('select', scope)"
        />
    </div>
</template>