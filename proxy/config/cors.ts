import { cors } from "hono/cors";

const devOrigins = [
	"http://localhost:3000",
	"http://10.0.0.4:3000"
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
	? process.env.ALLOWED_ORIGINS.split(",")
	: devOrigins;

export const appCors = () => cors({
	origin: allowedOrigins,
	allowMethods: ["GET", "POST", "DELETE"],
	allowHeaders: ["Content-Type"],
	credentials: true
});
