import { apiClientAppKt } from "@/api/apiClient";
import type { UserRes } from "@/types/userTypes";
import { useQuery } from "@tanstack/vue-query";

export const useUserQuery = () => useQuery({
    queryKey: ["user"],
    queryFn: () => apiClientAppKt.req<UserRes>({
        method:"GET",
        path: "/user"
    })
})