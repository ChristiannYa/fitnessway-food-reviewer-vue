import type { CookieOptions } from "hono/utils/cookie";

type cookieConfig = {
	name: string;
	options: CookieOptions;
};

const cookies = {
	refresh: {
		name: "refreshToken",
		options: {
			httpOnly: true,
			secure: false, // @TODO: Change to true when deploying
			path: "/",
			maxAge: 60 * 60 * 24 * 30 // 30 days
		}
	}
} satisfies Record<string, cookieConfig>;

export default cookies;
