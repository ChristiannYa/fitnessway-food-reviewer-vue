import { cors } from "hono/cors";
import { APP_BASE_URL } from "../../src/config/config";

export const appCors = () =>
	cors({
		origin: [APP_BASE_URL, "http://10.0.0.4:3000"],
		allowMethods: ["GET", "POST", "DELETE"],
		allowHeaders: ["Content-Type"],
		credentials: true
	});
