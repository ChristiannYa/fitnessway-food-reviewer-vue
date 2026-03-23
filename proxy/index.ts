import { Hono } from "hono";
import { appCors } from "./config/cors";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import cookies from "./config/cookies";
import { PROXY_PORT } from "../src/config/config";
import { serve } from "@hono/node-server";

const app = new Hono();

app.use(appCors());

app.get("/pxy/token", (c) => {
	const refreshToken = getCookie(c, cookies.refresh.name) ?? "";
	return c.json({ success: true, data: { refreshToken: refreshToken } });
});

app.post("/pxy/token", async (c) => {
	const { refreshToken } = await c.req.json();
	setCookie(c, cookies.refresh.name, refreshToken, cookies.refresh.options);
	return c.json({ success: true, data: null });
});

app.delete("/pxy/token", (c) => {
	deleteCookie(c, cookies.refresh.name);
	return c.json({ success: true, data: null });
});

serve({ fetch: app.fetch, port: PROXY_PORT });
