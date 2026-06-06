const isProd = import.meta.env.PROD;
const origin = window.location.origin;

const RAILWAY_KT  = import.meta.env.VITE_RAILWAY_KT  ?? "";
const RAILWAY_GO  = import.meta.env.VITE_RAILWAY_GO  ?? "";
const RAILWAY_PXY = import.meta.env.VITE_RAILWAY_PXY ?? "";

export const API_BASE_URL_KT = isProd
	? `${RAILWAY_KT}/api/kt`
	: `${origin}/api/kt`;

export const API_BASE_URL_GO = isProd
	? `${RAILWAY_GO}/api/go`
	: `${origin}/api/go`;

export const PROXY_BASE_URL  = isProd
	? RAILWAY_PXY
	: origin;
