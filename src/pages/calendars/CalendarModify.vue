<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 수정" :back="true" backTo="calendars/info" />
    </template>
    <div class="calendar-form-page">
      <div class="page-top-space"></div>

      <CalendarForm :form="form" mode="input">

      <div class="button-area">
        <AppButton text="저장" @click="saveCalendar" />
      </div>
      </CalendarForm>

      <div class="page-bottom-space"></div>
    </div>
    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '@/components/commons/AppButton.vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const router = useRouter();

const saveCalendar = () => {
  router.push({name: 'calendars'});
};

const form = ref({
  title: '팀회의',
  date: '2026-04-10',
  time: '14:00',
  expenseId: 'exp_042',
  memo: '2시간 동안 진행',
});
</script>

<style scoped>
.calendar-form-page {
  padding: 0 18px 22px;
  background-color: #f3f3f3;
  box-sizing: border-box;
  min-height: 100%;
}

.button-area {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.page-top-space {
  height: 56px;
}

.page-bottom-space {
  height: 60px;
}
</style>
