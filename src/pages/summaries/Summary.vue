<template>
  <div class="summary-page">

    <SummaryChart />

    <SummaryTotals />

    <MonthlyComparison />

  </div>
</template>

<script setup>
import SummaryChart from '@/components/summaries/SummaryChart.vue';
import SummaryTotals from '@/components/summaries/SummaryTotals.vue';
import MonthlyComparison from '@/components/summaries/MonthlyComparison.vue';
</script>

<style scoped>
.summary-page {
  padding: 18px;
  background-color: #f3f3f3;
  box-sizing: border-box;
}
</style>