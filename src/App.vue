<script setup lang="ts">
import Spinner from './components/shared/Spinner.vue';
import { useAppStore } from './hooks/composables/stores/authStore';

const appStore = useAppStore();
</script>

<template>
	<RouterView />
	<Spinner 
		v-if="appStore.isLoading" 
		class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
	/>
</template>
