export const APP_PORT = 3000;
export const PROXY_PORT = APP_PORT + 1;

const API_PORT = 1144;
const API_PORT_GO = 5050;

const currentHost = typeof window !== "undefined"
	? window.location.hostname
	: "localhost";

const currentProtocol = typeof window !== "undefined"
	? window.location.protocol
	: "http:";

export const APP_BASE_URL = `${currentProtocol}//${currentHost}:${APP_PORT}`;
export const API_BASE_URL_KT = `http://${currentHost}:${API_PORT}/api/kt`;
export const API_BASE_URL_GO = `http://${currentHost}:${API_PORT_GO}/api/go`
export const PROXY_BASE_URL = `${currentProtocol}//${currentHost}:${APP_PORT}`;
