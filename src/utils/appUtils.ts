export function isMobile(): boolean {
	const userAgent = navigator.userAgent;
	return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
};
