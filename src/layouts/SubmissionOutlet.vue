<script setup lang="ts">
import ViewBottomNavbar from '@/components/shared/ViewBottomNavbar.vue';
import type { NavConfig } from '@/types/appTypes';
import { CirclePlus, List } from 'lucide-vue-next';

const navConfig: NavConfig = {
	links: [
		{ to: "/submission/submit", label: "Submit", icon: CirclePlus },
		{ to: "/submission/submissions", label: "Submissions", icon: List },
	]
};
</script>

<template>
	<RouterView/>
	<div class="w-full bg-dark-secondary pb-2 pt-2 px-2">
		<ViewBottomNavbar
			:nav-config="navConfig"
			class="mx-auto view-child-w"
		/>
	</div>
</template>