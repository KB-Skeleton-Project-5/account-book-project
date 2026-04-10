<template>
  <div class="comparison-box">
    <div class="comparison-title">전월 대비 분석</div>
춰
    <template v-if="comparison">
      <div class="comparison-row">
        <span class="label">전월 지출</span>
        <span class="value"
          >{{ comparison.prevExpense.toLocaleString() }}원</span
        >
      </div>
      <div class="comparison-row">
        <span class="label">이번 달 지출</span>
        <span class="value">{{ summaryData.expense.toLocaleString() }}원</span>
      </div>

      <!-- 바 -->
      <div class="bar-section">
        <div class="bar-row">
          <span class="bar-label">전월</span>
          <div class="bar-track">
            <div class="bar prev" :style="{ width: prevBarWidth + '%' }"></div>
          </div>
        </div>
        <div class="bar-row">
          <span class="bar-label">이번달</span>
          <div class="bar-track">
            <div
              class="bar current"
              :class="{ decreased: comparison.diff < 0 }"
              :style="{ width: currentBarWidth + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 증감 요약 -->
      <div class="diff-summary">
        <span class="diff-label">전월 대비</span>
        <span class="diff-value" :class="comparison.diff < 0 ? 'good' : 'bad'">
          {{ comparison.diff > 0 ? '+' : ''
          }}{{ comparison.diff.toLocaleString() }}원 ({{
            comparison.diff > 0 ? '+' : ''
          }}{{ comparison.diffRate }}%)
        </span>
      </div>
    </template>

    <div v-else class="empty-text">데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil';

const props = defineProps({
  selectedDate: Object,
});

const summaryList = ref([]);

const fetchSummary = async () => {
  const { id } = getUserInfo();
  const res = await axios.get('/api/summarydb', { params: { userId: id } });
  summaryList.value = res.data;
};

const summaryData = computed(() => {
  return (
    summaryList.value.find(
      (item) =>
        item.year === props.selectedDate.year &&
        item.month === props.selectedDate.month,
    ) || null
  );
});

const comparison = computed(() => {
  return summaryData.value?.comparison?.[0] || null;
});

const maxExpense = computed(() => {
  if (!comparison.value) return 1;
  return Math.max(comparison.value.prevExpense, summaryData.value.expense);
});

const prevBarWidth = computed(() => {
  if (!comparison.value) return 0;
  return Math.round((comparison.value.prevExpense / maxExpense.value) * 100);
});

const currentBarWidth = computed(() => {
  if (!summaryData.value) return 0;
  return Math.round((summaryData.value.expense / maxExpense.value) * 100);
});

onMounted(fetchSummary);
watch(() => props.selectedDate, fetchSummary, { deep: true });
</script>

<style scoped>
.comparison-box {
  display: flex;
  flex-direction: column;
  border: 1px solid #777;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-top: 14px;
  margin-bottom: auto;
  box-sizing: border-box;
}

.comparison-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 14px;
}

.comparison-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
}

.label {
  width: 80px;
  flex-shrink: 0;
}

.value {
  font-weight: 600;
  color: #222;
  text-align: right;
}

.bar-section {
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.bar-label {
  font-size: 11px;
  color: #888;
  width: 40px;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  min-width: 0;
  height: 10px;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 99px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
  min-width: 4px; 
}

.bar.prev {
  background-color: #d0d0d0;
}

.bar.current {
  background-color: #f4a261;
}

.bar.current.decreased {
  background-color: #7ec8a4;
}

.diff-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
}

.diff-label {
  color: #888;
}

.diff-value {
  font-weight: 700;
  font-size: 14px;
  text-align: right;
}

.diff-value.good {
  color: #4caf50;
}

.diff-value.bad {
  color: #e53935;
}

.empty-text {
  font-size: 13px;
  color: #aaa;
  text-align: center;
  padding: 20px 0;
}
</style>
