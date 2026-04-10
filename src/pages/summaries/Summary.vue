<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="월별 재정 요약" />
    </template>

    <div class="summary-page">
      <MonthPicker v-model="selectedDate" />

      <SummaryChart :selectedDate="selectedDate" />

      <SummaryTotals :selectedDate="selectedDate" />

      <MonthlyComparison :selectedDate="selectedDate" class="comparison-box" />
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import MonthPicker from '@/components/commons/MonthPicker.vue';
import SummaryChart from '@/components/summaries/SummaryChart.vue';
import SummaryTotals from '@/components/summaries/SummaryTotals.vue';
import MonthlyComparison from '@/components/summaries/MonthlyComparison.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const now = new Date();
const selectedDate = ref({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
});
</script>

<style scoped>
.summary-page {
  /* padding: 18px; */
  padding: 0 24px 100px;
  background-color: white;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: calc(100vh - 120px); /*header+footer 제외 높이*/
}

.comparison-box {
  margin-top: 14px;
}
</style>
