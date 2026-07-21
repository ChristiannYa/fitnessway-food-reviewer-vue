<script setup lang="ts">
import type { AppEdibleData } from "@/types/foodTypes";
import { stringToIsoDate } from "@/utils/textUtils";
import EdibleBase from "./EdibleBase.vue";
import { Flag } from "lucide-vue-next";

const props = withDefaults(
    defineProps<{
        edibleData: AppEdibleData;
        isReportCountVisible?: boolean;
    }>(),
    {
        isReportCountVisible: false,
    },
);

const emit = defineEmits<{
    click: [];
}>();
</script>

<template>
    <div
        @click="emit('click')"
        class="bg-dark-tertiary border border-smoke/40 text-chalk rounded-md p-3 cursor-pointer hover:border-accent-primary transition-colors relative"
    >
        <span
            class="bg-dark-primary border border-smoke/40 text-sm leading-none p-1 rounded-sm absolute -top-3.5 right-0"
        >
            {{ stringToIsoDate(edibleData.edible.createdAt) }}
        </span>

        <div
            v-if="isReportCountVisible"
            class="h-6 bg-dark-primary border border-smoke/40 p-1 rounded-full absolute -bottom-3.5 right-0 flex items-center"
        >
            <p class="text-xs leading-tight font-bold">
                {{ edibleData.reports.length }}
            </p>
            <Flag class="h-full" />
        </div>

        <EdibleBase
            :food-base="edibleData.edible.information.base"
            :is-name-clickable="false"
        />
    </div>
</template>
