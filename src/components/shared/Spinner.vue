<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';

withDefaults(defineProps<{
	size?: number
}>(), {
	size: 24
})
</script>

<template>
	<LoaderCircle
		class="animate-spin"
		:size="size"
	/>
</template>