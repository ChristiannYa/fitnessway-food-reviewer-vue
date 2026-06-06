import { PxyRequestBaseError } from "@/errors/requestErrors";
import type { ProxyResponse } from "@/types/serverTypes";
import { toCamelCase as objToCamelCase } from "@/utils/objectUtils";
import {
	clientError,
	clientSuccess,
	type ClientResponse
} from "@/builders/clientResponseBuilders";
import { catchingErrorT } from "@/utils/errorUtils";
import { PROXY_BASE_URL } from "@/config/apiConfig";

async function makePxyRequest<R>(
	path: string,
	options?: RequestInit
): Promise<ProxyResponse<R>> {
	const res = await fetch(`${PROXY_BASE_URL}${path}`, {
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		...options
	});

	if (!res.ok) {
		throw new PxyRequestBaseError(`Proxy request to ${path} failed`, res.status);
	}

	return objToCamelCase(await res.json()) as ProxyResponse<R>;
}

async function handlePxyRequest<R>(
	path: string,
	options?: RequestInit
): Promise<ClientResponse<R>> {
	const [res, error] = await catchingErrorT(makePxyRequest<R>(path, options), [
		PxyRequestBaseError
	]);
	if (error !== null) return clientError(error.message, error.status);

	return clientSuccess(res.data as R);
}

export { handlePxyRequest as pxyReq };
