<template>
  <div>
    <div class="total-item">
      <span>총 수입</span>
      <strong>{{ summaryData?.income.toLocaleString() }}원</strong>
    </div>
    <div class="total-item">
      <span>총 지출</span>
      <strong>{{ summaryData?.expense.toLocaleString() }}원</strong>
    </div>
    <div class="total-item">
      <span>순이익</span>
      <strong>{{ summaryData?.netProfit.toLocaleString() }}원</strong>
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

// 전체 데이터 한 번만 불러오기
onMounted(async () => {
  const { id } = getUserInfo()  //추가
  const response = await axios.get('/api/summarydb', {
    params: { userId: id } // userId 파라미터 추가
  });
  summaryList.value = response.data;
});

// for문으로 선택한 월 찾기
const summaryData = computed(() => {
  for (let i = 0; i < summaryList.value.length; i++) {
    if (
      summaryList.value[i].year === props.selectedDate.year &&
      summaryList.value[i].month === props.selectedDate.month
    ) {
      return summaryList.value[i];
    }
  }
  return null;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
</style>
