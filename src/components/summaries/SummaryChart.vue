<template>
  <div class="chart-section">
    <div class="pie-chart" :style="{ background: conicGradient }"></div>
    <div class="legend">
      <!-- 데이터 없을 때 -->
      <div v-if="!legendItems.length" class="no-data">
        해당 월 데이터가 없습니다
      </div>

      <!-- 데이터 있을 때 -->
      <div v-for="item in legendItems" :key="item.tag" class="legend-item">
        <span
          class="legend-dot"
          :style="{ backgroundColor: item.color }"
        ></span>
        <span class="legend-label">{{ item.tag }}</span>
        <span class="legend-value">{{ item.percent }}%</span>
      </div>
    </div>
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
  } catch (e) {
    console.log(e);
    expenseList.value = [];
  }
};

// 선택한 월의 지출 데이터만 필터링
const filteredExpenses = computed(() => {
  return expenseList.value.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getFullYear() === props.selectedDate.year &&
      d.getMonth() + 1 === props.selectedDate.month &&
      e.type?.typetitle === '지출' // 지출만
    );
  });
});

// 태그별로 금액 합산
const legendItems = computed(() => {
  const tagMap = {};

  filteredExpenses.value.forEach((e) => {
    const tagName = e.tag?.tagtitle || '기타';
    const color = e.tag?.color || '#ccc';
    if (!tagMap[tagName]) {
      tagMap[tagName] = { tag: tagName, color, amount: 0 };
    }
    tagMap[tagName].amount += e.amount;
  });

  const total = Object.values(tagMap).reduce((s, t) => s + t.amount, 0);

  return Object.values(tagMap).map((t) => ({
    tag: t.tag,
    color: t.color,
    percent: total ? Math.round((t.amount / total) * 100) : 0,
  }));
});

const conicGradient = computed(() => {
  if (!legendItems.value.length) return '#eee';
  let current = 0;
  const stops = legendItems.value.map((item) => {
    const start = current;
    current += item.percent;
    return `${item.color} ${start}% ${current}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
});

onMounted(fetchExpenses);
</script>

<style scoped>
.chart-section {
  display: flex;
  align-items: center;
  justify-content: center;
  /* gap: 24px; */
  gap: 40px;
  margin: 40px 0 20px;
}

.pie-chart {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  flex-shrink: 0;
}

.no-data {
  font-size: 13px;
  color: #888;
  text-align: center;
  padding: 8px 0;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 1; /*글자 높이 때문에 정렬 튀는걸  */
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  color: #444;
  min-width: 40px;
}

.legend-value {
  color: #888;
  font-size: 12px;
}
</style>
