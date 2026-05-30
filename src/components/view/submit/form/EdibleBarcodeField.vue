<script setup lang="ts">
import ActionButton from '@/components/shared/ActionButton.vue';
import { useBarcodeScanner } from '@/hooks/composables/useBarcodeScanner';
import { nextTick, ref, watch } from 'vue';


const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const isVideoVisible = ref(false);

const { 
	barcode, 
	isScanning, 
	error: isScanError, 
	startScanning, 
	stopScanning 
} = useBarcodeScanner();

async function toggleScan() {
	if (isVideoVisible.value) {
		isVideoVisible.value = false;
		stopScanning();
	} else {
		isVideoVisible.value = true;
		await nextTick();
		if (videoElement.value) await startScanning(videoElement.value)
	}
}

// Will activate when scan works
watch(barcode, (b) => {
	if (b) {
		emit('update:modelValue', b);
		isVideoVisible.value = false;
		stopScanning();
	}	
})
</script>

<template>
	<div>
		<div class="flex flex-col gap-y-4">
			<div v-if="isVideoVisible" class="relative">
				<video ref="videoElement"/>
				<p 
					v-if="isScanning"
					class="opacity-90 text-chalk text-sm absolute bottom-2 
						   left-1/2 -translate-x-1/2"
				>
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
				:label="isVideoVisible
					? 'Stop Scan'
					: 'Start Scan'"
				background-color="#6a7282"
				border-hover-color="#d1d5dc70"
			/>

			<input 
				type="text"
				:value="barcode ?? ''"
				placeholder="011110150974"
				class="input-base bg-smoke/20 rounded-full border-2 border-smoke 
					 focus:border-accent-primary text-center p-3 w-full"
				@input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
			>
		</div>
	</div>
</template>
