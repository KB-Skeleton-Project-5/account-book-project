<template>
  <div class="chart-section">
    <div class="pie-chart" :style="{ background: conicGradient }"></div>
    <div class="legend">
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
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil';

const props = defineProps({
  selectedDate: Object,
});

const TAG_COLORS = {
  식비: '#f2d778',
  교통비: '#7ec8a4',
  쇼핑: '#f4a261',
  기타: '#a8d8ea',
};

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

const legendItems = computed(() => {
  if (!summaryData.value?.tagBreakdown) return [];
  const total = summaryData.value.tagBreakdown.reduce(
    (s, t) => s + t.amount,
    0,
  );
  return summaryData.value.tagBreakdown.map((t) => ({
    tag: t.tag,
    color: TAG_COLORS[t.tag] || '#ccc',
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

onMounted(fetchSummary);
watch(() => props.selectedDate, fetchSummary, { deep: true });
</script>

<style scoped>
.chart-section {
  display: flex;
  align-items: center;
  justify-content: center;
  /* gap: 24px; */
  gap: 40px;      
  margin: 40px 0 30px;
  margin-bottom: 20px;
}


.pie-chart {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  flex-shrink: 0;
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
  line-height: 1;  /*글자 높이 때문에 정렬 튀는걸 방지 */
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
