<script setup lang="ts">
import ViewBottomNavbar from '@/components/shared/ViewBottomNavbar.vue';
import { useLayoutStore } from '@/hooks/composables/stores/layoutStore';
import type { NavConfig } from '@/types/appTypes';
import { useResizeObserver } from '@vueuse/core';
import { CirclePlus, List } from 'lucide-vue-next';
import { useTemplateRef } from 'vue';

const navConfig: NavConfig = {
	links: [
		{ to: "/submission/write-form", label: "Write Form", icon: CirclePlus },
		{ to: "/submission/submissions", label: "Submissions", icon: List },
	]
};

const layoutStore = useLayoutStore();
const viewBottomNavbarRef = useTemplateRef("viewBottomNavbarRef");

useResizeObserver(viewBottomNavbarRef, ([entry]) => {
	const height = entry.borderBoxSize?.[0]?.blockSize;
	layoutStore.setViewBottomNavbarHeight(height);
});
</script>

<template>
	<RouterView/>
	<div 
		ref="viewBottomNavbarRef"
		class="w-full bg-dark-secondary pb-2 pt-2 px-2"
	>
		<ViewBottomNavbar
			:nav-config="navConfig"
			class="mx-auto view-child-w"
		/>
	</div>
</template>