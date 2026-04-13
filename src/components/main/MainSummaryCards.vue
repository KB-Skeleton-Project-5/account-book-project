<template>
  <section
    class="summary-section"
    @click="router.push({ name: 'summary' })"
    style="cursor: pointer"
  >
    <!-- 전월 대비 차액/퍼센트 -->
    <div class="comparison-header">
      <span class="comparison-label">전월 대비</span>
      <span class="comparison-value" :class="diff < 0 ? 'good' : 'bad'">
        {{ diff > 0 ? '+' : '' }}{{ diff.toLocaleString() }}원 ({{
          diff > 0 ? '+' : ''
        }}{{ diffRate }}%)
      </span>
    </div>

    <!-- 전월 그래프 + 금액 -->
    <div class="bar-row">
      <span class="bar-label">전월</span>
      <div class="bar-track">
        <div class="bar prev" :style="{ width: prevBarWidth + '%' }"></div>
      </div>
    </div>
    <div class="amount-row">
      <span class="amount-value">{{ prevTotal.toLocaleString() }}원</span>
    </div>

    <!-- 이번달 그래프 + 금액 -->
    <div class="bar-row">
      <span class="bar-label">이번달</span>
      <div class="bar-track">
        <div
          class="bar current"
          :class="{ decreased: diff < 0 }"
          :style="{ width: currentBarWidth + '%' }"
        ></div>
      </div>
    </div>
    <div class="amount-row">
      <span class="amount-value">{{ currentTotal.toLocaleString() }}원</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil';

const router = useRouter();

const expenseList = ref([]);

const fetchExpenses = async () => {
  try {
    const { id } = getUserInfo();
    const res = await axios.get('/api/expenses', { params: { user_id: id } });
    expenseList.value = res.data;
  } catch (e) {
    expenseList.value = [];
  }
};

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

const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = now.getMonth() + 1;
const prevYear = thisMonth === 1 ? thisYear - 1 : thisYear;
const prevMonth = thisMonth === 1 ? 12 : thisMonth - 1;

const currentTotal = computed(() => calcExpense(thisYear, thisMonth));
const prevTotal = computed(() => calcExpense(prevYear, prevMonth));

const diff = computed(() => currentTotal.value - prevTotal.value);
const diffRate = computed(() => {
  if (!prevTotal.value) return 0;
  return Math.round((diff.value / prevTotal.value) * 1000) / 10;
});

const maxVal = computed(
  () => Math.max(prevTotal.value, currentTotal.value) || 1,
);
const prevBarWidth = computed(() =>
  Math.round((prevTotal.value / maxVal.value) * 100),
);
const currentBarWidth = computed(() =>
  Math.round((currentTotal.value / maxVal.value) * 100),
);

onMounted(fetchExpenses);
</script>

<style scoped>
.summary-section {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comparison-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #545045;
}

.comparison-value {
  font-size: 0.85rem;
  font-weight: 700;
}

.comparison-value.good {
  color: #4caf50;
}

.comparison-value.bad {
  color: #e53935;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-size: 0.75rem;
  color: #9e9e9e;
  width: 40px;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 10px;
  background: #f0f0f0;
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
  background: #d0d0d0;
}

.bar.current {
  background: #f4a261;
}

.bar.current.decreased {
  background: #7ec8a4;
}

.amount-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 6px;
}

.amount-value {
  font-size: 0.8rem;
  color: #545045;
  font-weight: 600;
}
</style>
