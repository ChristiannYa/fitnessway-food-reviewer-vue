import { refreshAccessToken } from "@/auth/authHandlers";
import { getRefreshTokenPxy } from "@/proxy/refreshTokenPxy";
import { useAccessTokenStore } from "@/hooks/composables/stores/accessTokenStore";
import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { getUserQuery } from "@/hooks/queries/userQueries";
import queryClient from "@/integrations/tanstackQuery";
import { useAppStore } from "@/hooks/composables/stores/authStore";

const routes: RouteRecordRaw[] = [
	{ path: "/login", component: () => import("@/views/LoginView.vue") },
	{ path: "/unauthorized", component: () => import("@/views/UnauthorizedView.vue") },
	{ path: "/", redirect: "/submission/write-form" },
	{
		path: "/",
		component: () => import("@/layouts/ProtectedOutlet.vue"),
		children: [
			{ 
				path: "/submission", 
				children: [
					{ path: "write-form/:edibleId?", component: () => import("@/views/EdibleWritingFormView.vue") },
					{ path: "submissions", component: () => import("@/views/SubmissionsView.vue") },
				]
			},
			{ 
                path: "/review",
                children: [
                    { path: "user-request", component: () => import("@/views/ReviewView.vue") },
                    { path: "edible-report", component: () => import("@/views/ReportReviewView.vue")},
                ]
            }
		]
	}
];

const router = createRouter({
	// With `createWebHistory()` in production, the host will have to redirect 
    // all paths to index.html
	history: createWebHistory(),
	routes
});

async function handleActiveSession(
	isLoginRoute: boolean,
	isUnauthorizedPath: boolean,
): Promise<string | undefined> {

	if (isLoginRoute) return "/";

	// Handles edge case where if an infinite loop on the user type check 
	// would occur if a non-admin lands with a valid token
	if (isUnauthorizedPath) return;

	try {
		const { 
			queryFn: userQueryFn,
			getOptions: getUserQueryOptions,
		} = getUserQuery();

		const userQk = getUserQueryOptions().queryKey;
		let user = queryClient.getQueryData(userQk)?.data?.user;

		// Fetch directly if not cached
		if (!user) {
			const userRes = await userQueryFn();
			user = userRes.data?.user;
			queryClient.setQueryData(userQk, userRes);
		};

		if (user && user.type !== 'ADMIN') return "/unauthorized";
	} catch {
		return "/login";
	}

	return;
};

async function preloadRouteComponents(to: RouteLocationNormalizedGeneric) {
	const matched = router.resolve(to);
	await Promise.all(
		matched.matched.map(record => {
			const comp = record.components?.default;
			if (typeof comp === "function") return (comp as Function)();
		})
	);
};

router.beforeEach(async (to) => {
	const isLoginRoute = to.path === "/login";
	const isUnauthorizedRoute = to.path === "/unauthorized";

	const appStore = useAppStore();
	appStore.setIsLoading(true);

	try {
		const accessTokenStore = useAccessTokenStore();
		if (accessTokenStore.token) return await handleActiveSession(isLoginRoute, isUnauthorizedRoute);

		const refreshToken = (await getRefreshTokenPxy()).data?.refreshToken;
		if (!refreshToken) { 
			// Do not attempt token refresh for non-logged in users
			return;
		};

		// Always refresh token on page load
		const accessToken = (await refreshAccessToken(refreshToken)).data?.accessToken;
		if (!accessToken) return;
		accessTokenStore.set(accessToken);

		if (isLoginRoute) return "/";

		return await handleActiveSession(isLoginRoute, isUnauthorizedRoute);
	} finally {
		await preloadRouteComponents(to);
		appStore.setIsLoading(false);
	};
});

export default router;
