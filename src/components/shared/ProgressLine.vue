<script setup lang="ts">
const {
    duration,
    bgColor
} = defineProps<{
    duration: number
    bgColor: string
}>()
</script>

<template>
    <div 
        class="h-0.5 animate-progress"
        :style="{ 
            backgroundColor: `#${bgColor}`,
            '--duration': `${duration}ms` 
        }"
    />
</template>

<style scoped>
@keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
}

.animate-progress {
    animation: progress var(--duration) linear forwards;
}
</style>