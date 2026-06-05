<script setup lang="ts">
import ActionButton from '@/components/shared/ActionButton.vue';
import { useBarcodeScanner } from '@/hooks/composables/useBarcodeScanner';
import { nextTick, ref, watch } from 'vue';

defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const videoElement = ref<HTMLVideoElement | null>(null);

const { 
	barcode, 
	isScanning, 
	isScanError, 
	startScanning, 
	stopScanning 
} = useBarcodeScanner();

async function toggleScan() {
	if (isScanning.value) {
		stopScanning();
	} else {
		await nextTick();

		const videoEl = videoElement.value;
		if (videoEl) await startScanning(videoEl);
	}
}

watch(barcode, (v) => {
	if (v) emit('update:modelValue', v);
})
</script>

<template>
	<div>
		<div class="flex flex-col gap-y-4">
			<div v-show="isScanning" class="relative">
				<video ref="videoElement"/>
				<p class="opacity-90 text-chalk text-sm absolute bottom-2 
						  left-1/2 -translate-x-1/2">
					Scanning
				</p>
			</div>

			<p 
				v-if="isScanError !== null" 
				class="text-red-500 text-center">
				{{ isScanError }}
			</p>

			<ActionButton
				@click="toggleScan"
				:label="isScanning
					? 'Stop Scan'
					: 'Start Scan'"
				background-color="#6a7282"
				border-hover-color="#d1d5dc70"
			/>

			<input 
				type="text"
				:value="modelValue"
				placeholder="011110150974"
				class="input-base bg-smoke/20 rounded-full border-2 border-smoke 
					 focus:border-accent-primary text-center p-3 w-full"
				@input="(e) => {
					emit('update:modelValue', (e.target as HTMLInputElement).value);
				}"
			>
		</div>
	</div>
</template>
