import { ref, onUnmounted, readonly, nextTick } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useBarcodeScanner() {
	const barcode = ref<string | null>(null);
	const isScanning = ref(false);
	const isScanError = ref<string | null>(null);

	const reader = new BrowserMultiFormatReader();

	async function startScanning(videoElement: HTMLVideoElement) {
		isScanning.value = true;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' }
			});

			videoElement.srcObject = stream;
			await videoElement.play();

			await reader.decodeFromVideoDevice(undefined, videoElement, (r, _) => {
				if (r) {
					barcode.value = r.getText();
					stopScanning();
				}
			});
		} catch (e) {
			isScanError.value = `Camera access error`;
			stopScanning();
		}
	};

	function stopScanning() {
		BrowserMultiFormatReader.releaseAllStreams();
		isScanning.value = false;
	};

	async function toggleScan(videoElement: HTMLVideoElement | null) {
		if (videoElement === null) return;

		if (isScanning.value) {
			stopScanning();
		} else {
			await nextTick();
			await startScanning(videoElement);
		}
	};

	function clearBarcode() {
		barcode.value = null;
	};

	onUnmounted(stopScanning);

	return {
		barcode: readonly(barcode), 
		isScanning,
		isScanError,
		startScanning,
		stopScanning,
		toggleScan,
		clearBarcode
	};
};
