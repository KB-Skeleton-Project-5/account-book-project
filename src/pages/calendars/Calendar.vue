<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정" />
    </template>

    <div class="calendar-page">
      <!-- 달력 카드 -->
      <div class="calendar-card">
        <div class="month-bar">
          <!--왼쪽 : 날짜 선택 -->
          <div class="month-left">
            <MonthPicker v-model="selectedDate" />
          </div>
          <!-- 오른쪽: 추가 버튼 -->
          <div class="month_right">
            <AppButton text="추가" @click="handleAdd" />
          </div>
        </div>

        <div class="calendar-box">달력 자리</div>
      </div>

      <!-- 일정 리스트 -->
      <div class="calendar-section">
        <div class="calendar-date">📅 4월 10일 일정</div>

        <CalendarItem :id="1" title="팀 회의" time="14:00" />

        <CalendarItem :id="2" title="스터디" time="16:00" />
      </div>
    </div>
    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import MonthPicker from '@/components/commons/MonthPicker.vue';
import AppButton from '@/components/commons/AppButton.vue';
import CalendarItem from '@/components/calendars/CalendarItem.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const router = useRouter();

const handleAdd = () => {
  router.push({name: 'calendars/add'});
};
</script>

<style scoped>
.calendar-page {
  padding: 18px;
  background-color: #f3f3f3;
  box-sizing: border-box;
  min-height: 100%;
}

.calendar-card {
  background-color: #e9e9e9;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 18px;
}

.month-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.month-left {
  display: flex;
  align-items: center;
}

.month-right {
  display: flex;
  align-items: center;
}

.calendar-box {
  height: 260px;
  background-color: #ffffff;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.calendar-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calendar-date {
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
  color: #222;
}
</style>
