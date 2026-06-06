const isProd = import.meta.env.PROD;
const origin = window.location.origin;

const RAILWAY_KT  = import.meta.env.VITE_RAILWAY_KT  ?? "";
const RAILWAY_PXY = import.meta.env.VITE_RAILWAY_PXY ?? "";

export const API_BASE_URL_KT = isProd
	? `${RAILWAY_KT}/api/kt`
	: `${origin}/api/kt`;

export const PROXY_BASE_URL  = isProd
	? RAILWAY_PXY
	: origin;
