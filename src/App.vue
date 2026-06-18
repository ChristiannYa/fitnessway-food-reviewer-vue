<script setup lang="ts">
import Spinner from './components/shared/Spinner.vue';
import { useAuthStore } from './hooks/composables/stores/authStore';

const authStore = useAuthStore();
</script>

<template>
	<div class="w-screen min-h-screen relative">
		<RouterView />
		<Spinner 
			v-if="authStore.isAuthLoading" 
			class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
		/>
	</div>
</template>
