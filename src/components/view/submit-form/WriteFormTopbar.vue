<script setup lang="ts">
import type { WriteType } from '@/types/foodTypes';
import { Info, ScanBarcode } from 'lucide-vue-next';

defineProps<{
	writeType: WriteType
}>();

const emit = defineEmits<{
	scan: [];
}>();
</script>

<template>
	<div class="w-full flex justify-between items-center">
		<div 
			class="text-chalk leading-none flex items-center gap-x-1">
			<Info :size="16"/>
			<p><b>{{ writeType }}</b> FORM</p>
		</div>

		<button 
			v-if="writeType === 'SUBMIT'"
			@click="emit('scan')"
			class="bg-smoke rounded-lg p-2 cursor-pointer flex gap-x-2 items-center"
		>
			<p class="leading-0">Find</p>
			<ScanBarcode :size="18"/>
		</button>
	</div>
</template>