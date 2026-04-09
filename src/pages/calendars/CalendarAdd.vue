<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 등록" />
    </template>

    <div class="calendar-form-page">
      <div class="page-top-space"></div>

      <!-- 입력 폼 -->
      <CalendarForm :form="form" mode="input" />

      <AppButton text="저장" @click="saveCalendar" />

      <div class="page-bottom-space"></div>
    </div>
    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import AppButton from '@/components/commons/AppButton.vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

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
  min-height: 100%;
}

.page-top-space {
  height: 56px;
}

.page-bottom-space {
  height: 60px;
}
</style>
