<script setup lang="ts">
import { useUserQuery } from '@/hooks/queries/userQueries';
import { Menu } from 'lucide-vue-next';
import { computed, ref, useTemplateRef } from 'vue';
import SideBar from './SideBar.vue';
import Spinner from '@/components/shared/Spinner.vue'
import { useLayoutStore } from '@/hooks/composables/stores/layoutStore.ts';
import { useResizeObserver } from "@vueuse/core";

const isMenuOpen = ref(false)

const { 
    isPending: uResPending,
    data: uResData
} = useUserQuery()

const user = computed(() => uResData?.value?.data?.user)

const layoutStore = useLayoutStore();
const headerRef = useTemplateRef('headerRef');

useResizeObserver(headerRef, ([entry]) => {
	const height = entry.borderBoxSize?.[0]?.blockSize;
	layoutStore.setHeaderHeight(height);
});
</script>

<template>
    <header 
		ref="headerRef"
		class="p-4 flex items-center justify-between w-full bg-dark-secondary 
		       shadow-lg"
	>
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
                    Fitnessway - Admin Panel
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
        @close-menu="() => isMenuOpen = false"
    />
</template>