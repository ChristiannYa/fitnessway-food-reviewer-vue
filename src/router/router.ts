import { refreshAccessToken } from "@/auth/authHandlers";
import { getRefreshTokenPxy } from "@/proxy/refreshTokenPxy";
import { useAccessTokenStore } from "@/stores/accessTokenStore";
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{ path: "/login", component: () => import("@/views/LoginView.vue") },
	{ path: "/", redirect: "/home" },
	{
		path: "/",
		component: () => import("@/layouts/ProtectedOutlet.vue"),
		beforeEnter: () => {
			const store = useAccessTokenStore();
			if (!store.accessToken) return "/login";
		},
		children: [{ path: "home", component: () => import("@/views/HomeView.vue") }]
	}
];

const router = createRouter({
	// With `createWebHistory()` in production, the host will have to redirect 
    // all paths to index.html
	history: createWebHistory(),
	routes
});

router.beforeEach(async () => {
	const store = useAccessTokenStore();
	if (store.accessToken) return;

	const refreshTokenPxyRes = await getRefreshTokenPxy();
	const refreshToken = refreshTokenPxyRes.data?.refreshToken;
	if (!refreshToken) return;

	const res = await refreshAccessToken(refreshToken);
	if (!res.data) return;

	store.save(res.data.accessToken);
});

export default router;
