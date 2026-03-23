import { ApiRequestBaseError } from "@/errors/requestErrors";
import type { RefreshRes } from "@/types/authTypes";
import { useAccessTokenStore } from "@/stores/accessTokenStore";
import { toSnakeCase, toCamelCase } from "@/utils/textUtils";
import { catchingErrorT } from "@/utils/errorUtils";
import {
	clientError,
	clientSuccess,
	type ClientResponse
} from "@/mappers/clientResponseMapper";
import type { KtServerResponse } from "@/types/serverTypes";
import { API_BASE_URL, PROXY_BASE_URL } from "@/config/config";
import { refreshAccessToken } from "@/auth/authHandlers";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpRequest<T> = {
	method: HttpMethod;
	path: string;
	body?: T;
	params?: Record<string, string>;
	isRetry?: boolean;
};

type HttpRequestData<T> = Omit<HttpRequest<T>, "isRetry">;

const createApiClient = (
	baseUrl: string,
	refreshHandler?: () => Promise<ClientResponse<RefreshRes>>
) => {
	async function makeRequest<R, T = unknown>(
		req: HttpRequest<T>
	): Promise<KtServerResponse<R>> {
		const url = new URL(`${baseUrl}${req.path}`);

		const headers = new Headers();
		headers.set("Content-Type", "application/json");

		const accessToken = useAccessTokenStore().accessToken;

		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken}`);
		}

		if (req.params) {
			Object.entries(req.params).forEach(([k, v]) => {
				url.searchParams.set(k, v);
			});
		}

		const res = await fetch(url, {
			method: req.method,
			headers: headers,
			body:
				req.body !== undefined
					? JSON.stringify(toSnakeCase(req.body as object))
					: undefined
		});

		if (!res.ok) {
			const error = (await res.json()) as KtServerResponse<never>;
			throw new ApiRequestBaseError(error.message, res.status);
		}

		return toCamelCase(await res.json()) as KtServerResponse<R>;
	}

	async function handleRequest<R, T = unknown>(
		req: HttpRequest<T>
	): Promise<ClientResponse<R>> {
		const [requestRes, requestError] = await catchingErrorT(makeRequest<R, T>(req), [
			ApiRequestBaseError
		]);

		if (requestError !== null) {
			if (requestError.status === 401 && !req.isRetry) {
				// Guard that returns early because the api client is a public instance
				if (!refreshHandler) {
					return clientError(requestError.message, requestError.status);
				}

				// The refresh handler lives outside ApiClient because reading httpOnly cookies
				// requires function that talks to a server — something ApiClient can/should not
				// do directly
				const refreshRes = await refreshHandler();

				if (!refreshRes.success) {
					console.log("error refreshing access token: ", refreshRes.message);
					return clientError(refreshRes.message, refreshRes.status);
				}

				useAccessTokenStore().save(refreshRes.data.accessToken);

				// Retry same request with refreshed access token
				return handleRequest<R>({ ...req, isRetry: true });
			}

			return clientError(requestError.message, requestError.status);
		}

		return clientSuccess(requestRes.data as R);
	}

	return {
		req: async <R, T = unknown>(req: HttpRequestData<T>) => handleRequest<R>(req)
	};
};

export const apiClientPxy = createApiClient(PROXY_BASE_URL);
export const apiClientPub = createApiClient(API_BASE_URL);
export const apiClientApp = createApiClient(API_BASE_URL, refreshAccessToken);
