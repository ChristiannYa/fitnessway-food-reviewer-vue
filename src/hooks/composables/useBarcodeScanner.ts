import { ref, onUnmounted, readonly, nextTick } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useBarcodeScanner() {
	const barcode = ref<string | null>(null);
	const isScanning = ref(false);
	const isScanError = ref<string | null>(null);

	const isVideoReady = ref(false);
	let lastVideoElement: HTMLVideoElement | null = null;

	let reader = new BrowserMultiFormatReader();
	let activeReaderId = 0;

	async function startScanning(videoElement: HTMLVideoElement) {
		lastVideoElement = videoElement;
		isScanning.value = true;
		isVideoReady.value = false;

		videoElement.addEventListener('playing', () => {
			isVideoReady.value = true;
		}, { once: true });

		reader = new BrowserMultiFormatReader();
		const currentReaderId = ++activeReaderId;

		try {
			await reader.decodeFromVideoDevice(undefined, videoElement, (r, _) => {
				if (r && isScanning.value && activeReaderId === currentReaderId) {
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
		isScanning.value = false;
		isVideoReady.value = false;

		const target = lastVideoElement;
		lastVideoElement = null;

		// Release the camera stream
		BrowserMultiFormatReader.releaseAllStreams();
		if (target?.srcObject) {
			const stream = target.srcObject as MediaStream;
			stream.getTracks().forEach(t => t.stop());
			target.srcObject = null;
		};
	};

	async function toggleScan(videoElement: HTMLVideoElement | null) {
		if (isScanning.value) {
			if (videoElement === null) return;
			stopScanning();
		} else {
			await nextTick();
			
			if (videoElement === null) return;
			await startScanning(videoElement);
		}
	};

	function clearBarcode() {
		barcode.value = null;
	};

	onUnmounted(stopScanning);

	return {
		barcode: readonly(barcode), 
		isScanning: readonly(isScanning),
		isScanError : readonly(isScanError),
		isVideoReady: readonly(isVideoReady),
		startScanning,
		stopScanning,
		toggleScan,
		clearBarcode
	};
};
