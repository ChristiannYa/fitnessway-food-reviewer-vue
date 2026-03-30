import { QueryClient } from "@tanstack/vue-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            gcTime: Infinity
        }
    }
})

export default queryClient