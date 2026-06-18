export function isMobile(): boolean {
	const userAgent = navigator.userAgent;
	return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
};

export async function withDelay<T>(fn: () => Promise<T>, delay: number = 300): Promise<T> {
	await new Promise(resolve => setTimeout(resolve, delay));
	return fn();
};
