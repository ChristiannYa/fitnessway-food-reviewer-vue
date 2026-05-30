export const APP_PORT = 3000;
export const PROXY_PORT = APP_PORT + 1;

export const API_PORT_KT = 1144;
export const API_PORT_GO = 5050;


const currentHost = typeof window !== "undefined"
	? window.location.hostname
	: "localhost";

const currentProtocol = typeof window !== "undefined"
	? window.location.protocol
	: "http:";

export const APP_BASE_URL = `${currentProtocol}//${currentHost}:${APP_PORT}`;

export const API_BASE_URL_KT = `${currentProtocol}//${currentHost}:${APP_PORT}/api/kt`;
export const API_BASE_URL_GO = `${currentProtocol}//${currentHost}:${APP_PORT}/api/go`

export const PROXY_BASE_URL = `${currentProtocol}//${currentHost}:${APP_PORT}`;
