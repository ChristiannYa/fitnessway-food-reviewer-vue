import { login, logout } from "@/auth/authHandlers";
import { useAccessTokenStore } from "@/hooks/composables/stores/accessTokenStore";
import { useMutation } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

export const useLoginMutation = () => {
	const router = useRouter();
	const store = useAccessTokenStore();

	return useMutation({
		mutationFn: login,
		onSuccess: async (ctx) => {
			if (ctx.status === 401) return
			if (!ctx.success) throw new Error(ctx.message);

			store.set(ctx.data.accessToken);
			await router.push("/submit");
		},
		onError: (error) => {
			console.log("error logging in: ", error.message);
		}
	});
};

export const useLogoutMutation = () => {
    const router = useRouter()
    const store = useAccessTokenStore()

    return useMutation({
        mutationFn: logout,
        onSuccess: async (ctx) => {
            store.clear()

            if (!ctx.success) {
                // Just log error to not block user in their account
                console.log("error when logging out: ", ctx.message)
            }

            await router.push("/login")
        },
        onError: (error) => {
            console.log("error logging out: ", error.message)
        }
    })
}
