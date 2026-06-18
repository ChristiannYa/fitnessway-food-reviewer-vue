<script setup lang="ts">
import ActionButton from '@/components/shared/ActionButton.vue';
import View from '@/components/shared/View.vue';
import { useLogoutMutation } from '@/hooks/mutations/authMutations';
import { getUserQuery } from '@/hooks/queries/userQueries';
import { computed } from 'vue';

const { mutate } = useLogoutMutation();
const { useQuery: useUserQuery } = getUserQuery();
const { data: userRes } = useUserQuery();
const user = computed(() => userRes.value?.data?.user);
</script>

<template>
	<View :has-padding="false" class="px-6">
		<div class="view-child-w flex flex-col items-center justify-center gap-y-6 my-auto"
		>
			<div>
				<p class="leading-none text-amber-500 font-semibold text-xl">Unauthorized</p>
				<p v-if="user" class="text-center text-smoke">{{ user.name }}</p>
			</div>
			<ActionButton
				@click="mutate"
				label="Ok"
				background-color="#088f8f"
			/>
		</div>
	</View>
</template>
