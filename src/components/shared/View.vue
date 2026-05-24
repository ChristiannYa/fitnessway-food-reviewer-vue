<script setup lang="ts">
type Props = {
	hasPadding?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  hasPadding: true 
})
</script>

<template>
	<div class="w-full min-h-dvh flex flex-col items-center">
		<div :class="[hasPadding ? 'pt-10 px-4' : '']">
			<slot/>
		</div>
	</div>
</template>