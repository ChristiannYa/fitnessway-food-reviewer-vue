<script setup lang="ts">
import { useUserQuery } from '@/hooks/queries/userQueries';
import { Menu } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import SideBar from './SideBar.vue';
import Spinner from '../elements/Spinner.vue';

const isMenuOpen = ref(false)

const { 
    isPending: uResPending,
    data: uResData
} = useUserQuery()

const user = computed(() => uResData?.value?.data?.user)
</script>

<template>
    <header class="p-4 flex items-center justify-between w-full bg-[#1c1c1c] text-white shadow-lg">
        <div class="flex items-center">
            <button
                @click="isMenuOpen = true"
                class="p-2 hover:cursor-pointer rounded-lg"
            >
                <Menu :size="24"/>
            </button>
            <h1 class="ml-4 text-xl font-semibold">
                <RouterLink
                    to="/"
                >
                    Fitnessway - Food Review
                </RouterLink>
            </h1>
        </div>
        <p v-if="user" class="text-xs opacity-60">{{ user.id }}</p>
        <Spinner v-if="uResPending"/>
    </header>

    <SideBar 
        :is-visible="isMenuOpen"
        :user="user"
        :is-user-loading="uResPending"
        :close-menu="() => isMenuOpen = false"
    />
</template>