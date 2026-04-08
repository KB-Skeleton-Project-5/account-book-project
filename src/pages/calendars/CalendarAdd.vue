<template>
  <div class="calendar-form-page">
    <div class="page-top-space"></div>

    <!-- 입력 폼 -->
    <CalendarForm :form="form" mode="input"/>

    <div class="page-bottom-space"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';

const form = ref({
  title: '',
  date: '',
  time: '',
  expenseId: '',
  memo: '',
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