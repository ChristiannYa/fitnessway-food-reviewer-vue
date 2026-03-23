import { apiClientApp } from "@/api/apiClient";
import type { UserRes } from "@/types/userTypes";
import { useQuery } from "@tanstack/vue-query";

export const useUserQuery = () => useQuery({
    queryKey: ["user"],
    queryFn: () => apiClientApp.req<UserRes>({
        method:"GET",
        path: "/user"
    })
})