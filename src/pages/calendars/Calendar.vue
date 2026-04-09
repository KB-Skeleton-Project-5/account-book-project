<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정" />
    </template>

    <div class="calendar-page">
      <!-- 달력 카드 -->
      <div class="calendar-card">
        <div class="month-bar">
          <span class="month-arrow">‹</span>
          <MonthPicker v-model="selectedDate" />
          <span class="month-arrow">›</span>
        </div>

        <div class="calendar-box">달력 자리</div>
      </div>

      <!-- 일정 리스트 -->
      <div class="calendar-section">
        <div class="calendar-date">📅 4월 10일 일정</div>

        <CalendarItem title="팀 회의" time="14:00" />

        <CalendarItem title="스터디" time="16:00" />

       
      </div>
    </div>
    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import MonthPicker from '@/components/commons/MonthPicker.vue';
import CalendarItem from '@/components/calendars/CalendarItem.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
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

.month-text {
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.month-arrow {
  font-size: 16px;
  color: #555;
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
