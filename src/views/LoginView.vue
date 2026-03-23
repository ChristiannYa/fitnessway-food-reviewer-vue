<script setup lang="ts">
import { useLoginMutation } from "@/hooks/mutations/authMutations";
import type { LoginReq } from "@/schemas/authSchema";
import { ref } from "vue";
import { Eye, EyeClosed } from "lucide-vue-next";

const isPasswordVisible = ref(false);

const { mutate, isPending } = useLoginMutation();

function handleLogin(e: Event) {
	const formData = new FormData(e.target as HTMLFormElement);
	const loginData: LoginReq = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		deviceName: "HP Envy x360 (Web)"
	};

	mutate({ loginData });
}
</script>

<template>
	<div class="flex flex-col gap-4 w-100 mx-auto pt-4">
		<form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-full">
			<input
				type="email"
				name="email"
				placeholder="Enter your email"
				class="border p-2 w-full"
			/>
			<div class="w-full relative">
				<input
					:type="isPasswordVisible ? 'text' : 'password'"
					name="password"
					placeholder="Enter your password"
					class="border pl-2 py-2 pr-10 w-full"
				/>
				<button
					type="button"
					@click="isPasswordVisible = !isPasswordVisible"
					class="absolute top-1/2 right-2 -translate-y-1/2 hover:cursor-pointer"
				>
					<Eye v-if="isPasswordVisible" />
					<EyeClosed v-else />
				</button>
			</div>

			<button
				type="submit"
				:disabled="isPending"
				class="h-10 bg-cyan-700 p-2 rounded-md hover:cursor-pointer"
			>
				<span
					v-if="isPending"
					class="block mx-auto w-6 h-6 border-4 border-transparent border-x-white/70 
                         border-t-white/70 rounded-full animate-spin"
				/>
				<p v-else>Login</p>
			</button>
		</form>
	</div>
</template>
