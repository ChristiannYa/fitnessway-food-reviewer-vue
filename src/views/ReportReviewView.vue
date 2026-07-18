<script setup lang="ts">
import View from '@/components/shared/View.vue';
import { getReportsQuery } from '@/hooks/queries/edibleQueries';
import { reportsScrollState } from '@/state/scrollState';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

const scrollRef = ref<HTMLElement | null>(null);

const {
    accumulatedItems: accumulatedReports,
    offset,
} = reportsScrollState;

const {
    data: reportsRes,
    isPending: isReportsPending,
    isFetching: isReportsFetching,
    isError: isReportsError,
} = useQuery(computed(() => {
    const { getOptions } = getReportsQuery(); 
    return ({ ...getOptions({ offset: offset.value, status: "pending" }) })
}));
</script>

<template>
    <View>
        <div>
            <h1>This is were you review user reports about food</h1>
        </div>
    </View>
</template>

