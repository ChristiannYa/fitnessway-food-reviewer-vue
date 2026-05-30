import { ref, onUnmounted } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useBarcodeScanner() {
	const barcode = ref<string | null>(null);
	const isScanning = ref(false);
	const error = ref<string | null>(null);

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
				}
			});
		} catch (_) {
			error.value = `Camera access error`;
			isScanning.value = false;
		}
	};

	function stopScanning() {
		BrowserMultiFormatReader.releaseAllStreams();
		isScanning.value = false;
	};

	onUnmounted(stopScanning);

	return {
		barcode, 
		isScanning,
		error,
		startScanning,
		stopScanning 
	}
}
