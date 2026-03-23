import { login, logout } from "@/auth/authHandlers";
import { useAccessTokenStore } from "@/stores/accessTokenStore";
import { useMutation } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

export const useLoginMutation = () => {
	const router = useRouter();
	const store = useAccessTokenStore();

	return useMutation({
		mutationFn: login,
		onSuccess: async (ctx) => {
			if (!ctx.success) {
				console.log("error logging in: ", ctx.message);
				return;
			}

			store.save(ctx.data.accessToken);
			await router.push("/home");
		},
		onError: (error) => {
			console.log("(E) error logging in: ", error.message);
		}
	});
};

export const useLogoutMutation = () => {
    const router = useRouter()
    const store = useAccessTokenStore()

    return useMutation({
        mutationFn: logout,
        onSuccess: async (ctx) => {
            // Clear access token regardles of the server response
            store.clear()

            if (!ctx.success) {
                // Just log error to not block user in their account
                console.log("error when logging out: ", ctx.message)
            }

            await router.push("/login")
        },
        onError: (error) => {
            console.log("(E) error logging out: ", error.message)
        }
    })
}
