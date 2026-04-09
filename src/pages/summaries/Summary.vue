<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title=" 월별 재정 요약" />

       <MonthPicker v-model="selectedDate" />
    </template>

    <div class="summary-page">
      <SummaryChart />

      <SummaryTotals />

      <MonthlyComparison class="comparison-box"/>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import MonthPicker from '@/components/commons/MonthPicker.vue';
import SummaryChart from '@/components/summaries/SummaryChart.vue';
import SummaryTotals from '@/components/summaries/SummaryTotals.vue';
import MonthlyComparison from '@/components/summaries/MonthlyComparison.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
</script>

<style scoped>
.summary-page {

  padding: 18px;
  background-color: #fdfbfb;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
} 
.comparison-box {
  flex: 1;
  display: flex;
}

</style>
