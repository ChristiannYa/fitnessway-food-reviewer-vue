<script setup lang="ts">
import { useLoginMutation } from "@/hooks/mutations/authMutations";
import type { LoginReq } from "@/schemas/authSchema";
import { computed, ref } from "vue";
import { Eye, EyeClosed } from "lucide-vue-next";
import View from "@/components/shared/View.vue";

const { mutate, data, isPending, isError } = useLoginMutation();

const email = ref("");
const password = ref("");
const isPasswordVisible = ref(false);

const isSubmitDisabled = computed(() => 
	isPending.value || !email.value || !password.value
);

function handleLogin(_: Event) {
	const loginData: LoginReq = {
		email: email.value,
		password: password.value,
		deviceName: "HP Envy x360 (Web)"
	};

	mutate({ loginData });
}
</script>

<template>
	<View :has-padding="false" class="justify-center">
		<div class="flex flex-col gap-4 w-100 my-auto">
			<h1 class="text-xl font-semibold">
				Fitnessway Admin Panel
			</h1>

			<form @submit.prevent="handleLogin" class="text-chalk flex flex-col gap-4 w-full">
				<input
					v-model="email"
					type="email"
					name="email"
					placeholder="Enter your email"
					class="border border-chalk focus:outline-none p-3 w-full"
					style="color: inherit;"
				/>
				<div class="w-full relative">
					<input
						v-model="password"
						:type="isPasswordVisible ? 'text' : 'password'"
						name="password"
						placeholder="Enter your password"
						class="border border-chalk focus:outline-none pl-3 py-3 pr-10 w-full"
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

				<p v-if="data?.status === 401" class="text-center text-amber-500">
					Invalid credentials
				</p>

				<p v-if="isError" class="text-red-500 text-center">
					Login failed
				</p>

				<button
					type="submit"
					:disabled="isSubmitDisabled"
					:class="[ 
						'bg-accent-primary rounded-xl h-10 p-2',
						isSubmitDisabled 
							? 'opacity-70 cursor-default' 
							: 'opacity-100 cursor-pointer', 
					]"
				>
					<span
						v-if="isPending"
						class="block mx-auto w-6 h-6 border-4 border-transparent border-x-white/70 
							border-t-white/70 rounded-full animate-spin"
					/>
					<p v-else class="text-white">Login</p>
				</button>
			</form>
		</div>
	</View>
</template>
