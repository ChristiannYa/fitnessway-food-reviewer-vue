import { ref, onUnmounted } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useBarcodeScanner() {
	const barcode = ref<string | null>(null);
	const isScanning = ref(false);
	const error = ref<string | null>(null);

	const reader = new BrowserMultiFormatReader();

	async function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
		return new Promise((resolve) => {
			const check = () => {
				if (video.readyState >= 2 && video.videoWidth > 0) {
					resolve();
				} else {
					requestAnimationFrame(check);
				}
			};
			check();
		});
	}

	async function startScanning(videoElement: HTMLVideoElement) {
		const log = (l: string) => console.log(`[useBarcodeScanner, startScanning] ${l}`)

		log(`videoElement: ${videoElement}`);
		log(`videoElement dimensions: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
		log(`videoElement readyState: ${videoElement.readyState}`);

		isScanning.value = true;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' }
			});

			videoElement.srcObject = stream;
			await videoElement.play();

			log(`video ready: ${videoElement.videoWidth}x${videoElement.videoHeight}`);

			await reader.decodeFromVideoDevice(undefined, videoElement, (r, err) => {
				log(`callback fired, result: ${r}, err: ${err}`);

				if (r) {
					const b = r.getText();
					log(`barcode found: ${b}`);

					barcode.value = b;
					stopScanning();
				}
			});
		} catch (e) {
			log(`caught error: ${e}`)
			error.value = "Camera access error";
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
