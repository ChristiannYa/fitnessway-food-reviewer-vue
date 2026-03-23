import { cors } from "hono/cors";
import { APP_BASE_URL } from "../../src/config/config";

export const appCors = () =>
	cors({
		origin: APP_BASE_URL,
		allowMethods: ["GET", "POST", "DELETE"],
		allowHeaders: ["Content-Type"],
		credentials: true
	});
