<script setup lang="ts">
import { useLogoutMutation } from "@/hooks/mutations/authMutations";
import type { User } from "@/types/userTypes";
import { ArrowLeft, Home } from "lucide-vue-next";
import Spinner from "@/components/elements/Spinner.vue";

const props = defineProps<{
	isVisible: boolean;
    user?: User;
    isUserLoading: boolean;
}>();

const emit = defineEmits<{
    closeMenu: []
}>()

const navConfig = {
    items: [{ to: "/home", label: "Home", icon: Home }],
    itemBaseClass: "flex items-center gap-3 p-3 mb-2 font-medium rounded-lg transition-colors"
}

const logoutMutation = useLogoutMutation()

function handleLogout() {
    emit('closeMenu')
    logoutMutation.mutate(undefined)
}
</script>

<template>
	<aside
		class="fixed top-0 left-0 h-full w-80 bg-dark-tertiary text-white shadow-2xl
               z-50 transform transition-transform duration-300 ease-in-out 
               flex flex-col"
		:class="isVisible ? 'translate-x-0' : '-translate-x-full'"
	>
        <!-- Title -->
        <div class="flex items-center justify-between p-4 border-b border-b-white/10">
            <h2 class="text-xl font-bold">Quick Links</h2>
            <button
                @click="emit('closeMenu')"
                class="p-2 hover:cursor-pointer rounded-lg transition-colors"
                aria-label="Close menu"
            >
                <ArrowLeft :size=24 />
            </button>
        </div>

        <!-- Navigation & User data -->
         <div class="p-4 h-full flex flex-col">
            <div class="grow">
                <div 
                    v-if="isUserLoading"
                    class="flex justify-center"
                >
                    <Spinner/>
                </div>

                <!-- Navigation wrapper -->
                <div 
                    v-if="user"
                    class="h-full flex flex-col"
                >
                    <!-- Navigation -->
                    <nav class="grow">
                        <RouterLink
                            v-for="item in navConfig.items"
                            :key="item.to"
                            :to="item.to"
                            :class="[navConfig.itemBaseClass, 'hover:bg-gray-600']"
                            active-class="bg-dry-green hover:dry-green"
                        >
                            <component :is="item.icon" :size="20"/>
                            {{ item.label }}
                        </RouterLink>
                    </nav>

                    <!-- User data -->
                     <p v-if="user" class="text-white opacity-60 font-medium mx-auto">
                        {{ user.name }}
                     </p>
                </div>
            </div>
            <!-- Logout button -->
            <button
                @click="handleLogout"
                :class="[navConfig.itemBaseClass, 'justify-center  bg-red-600  hover:bg-red-500 w-full mt-4',
                        'hover:cursor-pointer']"
            >
                Log out
            </button>
         </div>
    </aside>
</template>
