<script setup lang="ts">
import type { AppEdibleData, AppEdibleReport } from "@/types/foodTypes";
import { getReportStatusUi } from "@/utils/foodUtils";
import { stringArrToText } from "@/utils/textUtils";
import { ref } from "vue";

const props = defineProps<{
    edibleData: AppEdibleData;
}>();

const clickedReport = ref<AppEdibleReport | null>(null);

function onClickReport(report: AppEdibleReport) {
    // prettier-ignore
    clickedReport.value = clickedReport.value === null 
        ? (clickedReport.value = report) 
        : null;
}
</script>

<template>
    <div class="action-popup text-chalk">
        <div>
            <p>{{ edibleData.edible.information.base.name }}</p>
            <p class="text-sm text-smoke">Reports</p>
        </div>

        <div
            v-for="report in edibleData.reports"
            @click="onClickReport(report)"
            class="bg-smoke/10 rounded-md cursor-pointer border border-transparent hover:border-smoke p-2"
        >
            <p
                :style="{
                    color: getReportStatusUi(report.status).hex,
                }"
                class="leading-tight font-semibold"
            >
                {{ report.status }}
            </p>
            <p>{{ stringArrToText(report.reasons) }}</p>
            <p
                v-if="
                    clickedReport !== null &&
                    clickedReport.id === report.id &&
                    !!report.notes
                "
                class="tex-sm opacity-60"
            >
                {{ report.notes }}
            </p>
        </div>
    </div>
</template>
