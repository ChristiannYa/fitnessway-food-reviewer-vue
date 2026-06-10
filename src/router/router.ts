import { refreshAccessToken } from "@/auth/authHandlers";
import { getRefreshTokenPxy } from "@/proxy/refreshTokenPxy";
import { useAccessTokenStore } from "@/hooks/composables/stores/accessTokenStore";
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

function handleProtectedOutletBeforeEnter() {
	const store = useAccessTokenStore();
	if (!store.accessToken) return "/login"
}

const routes: RouteRecordRaw[] = [
	{ path: "/login", component: () => import("@/views/LoginView.vue") },
	{ path: "/", redirect: "/submission/submit" },
	{
		path: "/",
		component: () => import("@/layouts/ProtectedOutlet.vue"),
		beforeEnter: handleProtectedOutletBeforeEnter,
		children: [
			{ 
				path: "/submission", 
				component: () => import("@/layouts/SubmissionOutlet.vue"), 
				children: [
					{ path: "submit", component: () => import("@/views/SubmitFormView.vue") },
					{ path: "submissions", component: () => import("@/views/SubmissionsView.vue") },
				]
			},
			{ path: "review", component: () => import("@/views/ReviewView.vue") }
		]
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

	store.set(res.data.accessToken);
});

export default router;
