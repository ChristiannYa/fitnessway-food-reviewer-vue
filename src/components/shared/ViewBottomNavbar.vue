<script setup lang="ts">
import type { NavConfig } from '@/types/appTypes';

const props = defineProps<{
	navConfig: NavConfig
}>();
</script>

<template>
	<nav ref="componentRef">
		<div class="flex gap-x-2">
			<RouterLink
				v-for="link in props.navConfig.links"
				:key="link.to"
				:to="link.to"
				class="bg-smoke/20 rounded-lg text-chalk px-1.5 py-3 flex flex-1 items-center justify-center gap-x-2"
			>
				<component 
					:is="link.icon" 
					:size="16" 
					class="text-chalk"
				/>
				{{ link.label }}
			</RouterLink>
		</div>
	</nav>
</template>