<script setup lang="ts">
import EdibleBase from "@/components/foods/EdibleBase.vue";
import Nutrients from "@/components/nutrients/Nutrients.vue";
import ActionButton from "@/components/shared/ActionButton.vue";
import type { AppEdibleData, AppEdibleReport } from "@/types/foodTypes";
import { getReportStatusUi } from "@/utils/foodUtils";
import { stringArrToText } from "@/utils/textUtils";
import { Flag } from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps<{
    edibleData: AppEdibleData;
}>();

const isEdibleNutrientsVisible = ref(false);
const clickedReport = ref<AppEdibleReport | null>(null);

function onClickReport(report: AppEdibleReport) {
    // prettier-ignore
    clickedReport.value = clickedReport.value === null 
        ? (clickedReport.value = report) 
        : null;
}

function onToggleReportView() {
    isEdibleNutrientsVisible.value = !isEdibleNutrientsVisible.value;
}
</script>

<template>
    <div class="action-popup text-chalk">
        <EdibleBase :foodBase="edibleData.edible.information.base" />

        <div class="flex flex-col gap-y-2">
            <ActionButton
                @click="onToggleReportView"
                :label="
                    isEdibleNutrientsVisible
                        ? 'Nutrients'
                        : `Reports (${edibleData.reports.length})`
                "
                labelColor="var(--color-accent-primary)"
                :icon="isEdibleNutrientsVisible ? undefined : Flag"
                :iconSize="16"
                :iconTwColor="
                    isEdibleNutrientsVisible
                        ? undefined
                        : 'text-accent-primary'
                "
                :isInverted="true"
            />
            <div
                v-if="!isEdibleNutrientsVisible"
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

            <Nutrients
                v-if="isEdibleNutrientsVisible"
                :nutrients="edibleData.edible.information.nutrients"
            />
        </div>
    </div>
</template>
