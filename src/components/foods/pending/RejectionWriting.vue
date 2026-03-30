<script setup lang="ts">
import ActionButton from '@/components/elements/ActionButton.vue';
import { isStringNullOrEmpty } from '@/utils/textUtils';
import { ref } from 'vue';

const emit = defineEmits<{
    cancel: []
    reject: [reason: string]
}>()

const hasClickedRejected = ref(false)
const rejectionReason = ref("")

function handleRejection() {
    hasClickedRejected.value = false
    emit('reject', rejectionReason.value)
}
</script>

<template>
    <div class="flex flex-col p-3 bg-black/50 backdrop-blur-lg">
        <div class="grow my-4 relative bg-smoke/40 border border-smoke rounded-lg">
            <textarea
                v-if="!hasClickedRejected"
                v-model="rejectionReason"
                placeholder="Rejection reason..."
                class="w-full h-full p-4 focus:outline-none focus:ring-1 focus:ring-mist 
                       rounded-lg resize-none"
            />

            <div
                v-else
                class="absolute top-0 left-0 px-2 w-full h-full flex flex-col justify-center 
                       items-center gap-8"
            >
                <p>Reject?</p>

                <div class="flex w-full gap-2 pb-1">
                    <ActionButton label="No" @click="hasClickedRejected = false" />
                    <ActionButton label="Yes" bg-color="bg-rose-600" @click="handleRejection" />
                </div>
            </div>
        </div>

        <div 
            v-if="!hasClickedRejected"
            class="flex w-full gap-2 pb-1"
        >
            <ActionButton 
                label="Cancel" 
                @click="emit('cancel')" 
            />
            <ActionButton
                label="Reject"
                bg-color="bg-rose-600"
                :disabled="isStringNullOrEmpty(rejectionReason)"
                @click="hasClickedRejected = true"
            />
        </div>
    </div>
</template>