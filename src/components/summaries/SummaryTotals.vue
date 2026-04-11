<template>
  <div>
    <div class="total-item">
      <span>총 수입</span>
      <strong
        >{{ summaryData ? summaryData.income.toLocaleString() : '0' }}원</strong
      >
    </div>
    <div class="total-item">
      <span>총 지출</span>
      <strong
        >{{
          summaryData ? summaryData.expense.toLocaleString() : '0'
        }}원</strong
      >
    </div>
    <div class="total-item">
      <span>순이익</span>
      <strong
        >{{
          summaryData ? summaryData.netProfit.toLocaleString() : '0'
        }}원</strong
      >
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { getUserInfo } from '@/util/authUtil';

const props = defineProps({
  selectedDate: Object,
});

const summaryList = ref([]);


onMounted(async () => {
  try {
    const { id } = getUserInfo();
    const response = await axios.get('/api/expenses', {
      params: { user_id: id },
    });
    summaryList.value = response.data;
  } catch (error) {
    console.log(error);
    summaryList.value = [];
  }
});

// expenses 데이터로 직접 계산
const summaryData = computed(() => {
  const filtered = summaryList.value.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getFullYear() === props.selectedDate.year &&
      d.getMonth() + 1 === props.selectedDate.month
    );
  });

  const income = filtered
    .filter((e) => e.type?.typetitle === '수입')
    .reduce((sum, e) => sum + e.amount, 0);

  const expense = filtered
    .filter((e) => e.type?.typetitle === '지출')
    .reduce((sum, e) => sum + e.amount, 0);

  return { income, expense, netProfit: income - expense };
});
</script>

<style scoped>
.total-item {
  height: 34px;
  border: 1px solid #777;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 12px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>
