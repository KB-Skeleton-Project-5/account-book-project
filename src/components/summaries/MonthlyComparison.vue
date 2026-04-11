<template>
  <div class="comparison-box">
    <div class="comparison-title">전월 대비 분석</div>

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
          {{ comparison.diff > 0 ? '+' : '' }}
          {{ (comparison.diff ?? 0).toLocaleString() }}원 (
          {{ comparison.diff > 0 ? '+' : '' }}
          {{ comparison.diffRate ?? 0 }}% )
        </span>
      </div>
    </template>

    <div v-else class="empty-text">전월 비교 데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil';

const props = defineProps({
  selectedDate: Object,
});

const expenseList = ref([]);

const fetchExpenses = async () => {
  try {
    const { id } = getUserInfo();
    const res = await axios.get('/api/expenses', { params: { user_id: id } });
    expenseList.value = res.data;
  } catch (error) {
    console.log(error);
    expenseList.value = [];
  }
};

// 특정 년/월의 지출 합계 계산하는 함수
const calcExpense = (year, month) => {
  return expenseList.value
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === year &&
        d.getMonth() + 1 === month &&
        e.type?.typetitle === '지출'
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);
};

// 이번 달 지출
const summaryData = computed(() => {
  const expense = calcExpense(
    props.selectedDate.year,
    props.selectedDate.month,
  );
  return { expense };
});

// 전월 계산 (1월이면 전년도 12월로)
const prevDate = computed(() => {
  const { year, month } = props.selectedDate;
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 };
});

// 전월 대비 비교 데이터
const comparison = computed(() => {
  const prevExpense = calcExpense(prevDate.value.year, prevDate.value.month);
  if (prevExpense === 0 && summaryData.value.expense === 0) return null;

  const diff = summaryData.value.expense - prevExpense;
  const diffRate = prevExpense
    ? Math.round((diff / prevExpense) * 1000) / 10
    : 0;

  return { prevExpense, diff, diffRate };
});

const maxExpense = computed(() => {
  if (!comparison.value) return 1;
  return Math.max(comparison.value.prevExpense, summaryData.value.expense) || 1;
});

const prevBarWidth = computed(() => {
  if (!comparison.value) return 0;
  return Math.round((comparison.value.prevExpense / maxExpense.value) * 100);
});

const currentBarWidth = computed(() => {
  if (!summaryData.value) return 0;
  return Math.round((summaryData.value.expense / maxExpense.value) * 100);
});

onMounted(fetchExpenses);
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
  margin-bottom: auto; /*이거 테스트시 이상하게 밀리면 빼기 */
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
