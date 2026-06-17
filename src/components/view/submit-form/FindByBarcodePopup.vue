<script setup lang="ts">
import EdibleOverview from '@/components/foods/EdibleOverview.vue';
import ActionButton from '@/components/shared/ActionButton.vue';
import BackgrundBlur from '@/components/shared/BackgrundBlur.vue';
import Spinner from '@/components/shared/Spinner.vue';
import { useBarcodeScanner } from '@/hooks/composables/useBarcodeScanner';
import { getAppEdibleByBarcodeQuery } from '@/hooks/queries/edibleQueries';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const queryClient = useQueryClient();

const wantsToScan = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);

const { 
	barcode: scannedBarcode,
	isScanning,
	isScanError,
	isVideoReady,
	startScanning,
	stopScanning,
	clearBarcode,
} = useBarcodeScanner();

const byBarcodeQueryOptions = computed(() => {
	const { getOptions } = getAppEdibleByBarcodeQuery();
	return ({
		...getOptions(scannedBarcode.value ?? ""),
		enabled: false
	});
});
const { 
	data: byBarcodeRes,
	isFetching: byBarcodeLoading,
	isError: byBarcodeError,
	status: byBarcodeStatus,
	refetch: byBarcodeRefetch
} = useQuery(byBarcodeQueryOptions);
const byBarcode = computed(() => byBarcodeRes.value?.data?.appEdible);

watch(scannedBarcode, (wscannedBarcode) => {
	if (!!wscannedBarcode) byBarcodeRefetch();
});

function onUpdateScanned() {
	if (!byBarcode.value) return;
	router.push(`/submission/write-form/${byBarcode.value.edible.id}`);
}

async function onWantsToScan() {
	wantsToScan.value = true;

	const videoEl = videoElement.value;
	if (videoEl === null) return;

	startScanning(videoEl);
};

async function onCancelScan() {
	// Capture key before clearing barcode, while it still matches the 
	// fetched query
	const queryKey = byBarcodeQueryOptions.value.queryKey

	// First, so the scanned barcode watcher can't retrigger a fetch
	clearBarcode(); 

	wantsToScan.value = false;
	
	if (isScanning.value) stopScanning();

	queryClient.resetQueries({ queryKey });
};

defineExpose({ onWantsToScan })
</script>

<template>
	<div v-show="wantsToScan" class="w-full h-full">
		<BackgrundBlur :is-visible="true" @click="onCancelScan"/>

		<div 
			class="bg-dark-secondary border border-accent-primary rounded-2xl 
				   w-100 max-w-11/12 h-120 p-2 flex flex-col gap-y-4 absolute 
				   top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
		>
			<div v-show="isScanning" class="rounded-md relative min-h-0 grow">
				<video ref="videoElement" class="rounded-md h-full w-full"/>
				<p v-if="isVideoReady" class="barcode-scan-text-indicator">Scanning</p>
			</div>

			<Spinner v-if="byBarcodeLoading" class="mx-auto my-auto" />

			<p v-if="byBarcode === null" class="text-center my-auto text-smoke">
				Not found
			</p>

			<p 
				v-if="byBarcodeError || byBarcodeRes?.success === false"
				class="text-red-500 text-center"
			>
				Error fetching edible by barcode
			</p>

			<p v-if="isScanError !== null" class="text-red-500 text-center">
				{{ isScanError }}
			</p>

			<EdibleOverview
				v-if="!!byBarcode"
				:edible-base="byBarcode.edible.information.base"
				:nutrients-by-type="byBarcode.edible.information.nutrients"
				class="overflow-y-scroll no-scrollbar w-full h-full p-2"
			/>

			<div 
				v-if="isScanning || byBarcodeStatus === 'success'"
				class="flex gap-x-4"
			>
				<ActionButton
					@click="onCancelScan"
					:label="isScanning ? 'Stop Scan' : 'Ok'"
					background-color="#6a7282"
					class="grow basis-0"
				/>	
				<ActionButton
					v-if="byBarcodeStatus === 'success' && byBarcode"
					@click="onUpdateScanned"
					label="Update"
					background-color="#088f8f"
					class="grow basis-0"
				/>
			</div>
		</div>
	</div>
</template>
