<script setup lang="ts">
import Header from '@/components/base/Header.vue';
import ViewBottomNavbar from '@/components/shared/ViewBottomNavbar.vue';
import { useLayoutStore } from '@/hooks/composables/stores/layoutStore';
import type { NavConfig } from '@/types/appTypes';
import { getFirstPathSegment } from '@/utils/textUtils';
import { useResizeObserver } from '@vueuse/core';
import {
    CirclePlus, 
    List, 
    MessageCircleWarning, 
    UserRoundSearch
} from "lucide-vue-next";
import { computed, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routePath = computed(() => route.path);

const navConfigs = {
    review: {
        links: [
            { to: "/review/user-request", label: "User request", icon: UserRoundSearch },
            { to: "/review/edible-report", label: "Review reports", icon: MessageCircleWarning }
        ]
    },
    submission: {
        links: [
            { to: "/submission/write-form", label: "Write Form", icon: CirclePlus },
            { to: "/submission/submissions", label: "Submissions", icon: List },
        ]
    }
};
const currentNavConfig = computed((): NavConfig | null => {
    const path = getFirstPathSegment(routePath.value);
    switch (path) {
        case "submission": return navConfigs.submission;
        case "review": return navConfigs.review;
        default: return null
    }
});

const layoutStore = useLayoutStore();
const viewBottomNavbarRef = useTemplateRef("viewBottomNavbarRef");

useResizeObserver(viewBottomNavbarRef, ([entry]) => {
    const height = entry.borderBoxSize?.[0]?.blockSize;
    layoutStore.setViewBottomNavbarHeight(height);
});

</script>

<template>
    <Header/>
	<RouterView :key="$route.fullPath"/>
    <div v-if="currentNavConfig !== null">
        <div 
            ref="viewBottomNavbarRef"
            class="w-full bg-dark-secondary pb-2 pt-2 px-2"
        >
            <ViewBottomNavbar
                :nav-config="currentNavConfig"
                class="mx-auto view-child-w"
            />
        </div>
    </div>
</template>

