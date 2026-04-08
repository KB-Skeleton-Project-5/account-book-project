<template>
  <div class="calendar-form-page">
    <div class="page-top-space"></div>

    <CalendarForm :form="form" mode="value"/>

    <div class="page-bottom-space"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';

const form = ref({
  title: '월급날',
  date: '2026-04-01',
  time: '09:00',
  expenseId: 'exp_042',
  memo: '급여 입금 예정',
});
</script>

<style scoped>
.calendar-form-page {
  padding: 0 18px 22px;
  background-color: #f3f3f3;
  box-sizing: border-box;
}

.page-top-space {
  height: 56px;
}

.page-bottom-space {
  height: 60px;
}
</style>