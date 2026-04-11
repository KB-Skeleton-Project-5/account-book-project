<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 등록" :back="true" backTo="calendars" />
    </template>

    <div class="calendar-form-page">
      <div class="page-top-space"></div>

      <!-- 입력 폼 -->
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
import axios from 'axios';

import AppButton from '@/components/commons/AppButton.vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import { getUserInfo } from '@/util/authUtil';

const router = useRouter();
const { id } = getUserInfo();

const form = ref({
  title: '',
  date: '',
  time: '',
  expenseId: '',
  memo: '',
});

const saveCalendar = async () => {
  if (!form.value.title) {
    alert('제목을 입력해주세요.');
    return;
  }
  if (!form.value.date) {
    alert('날짜를 선택해주세요.');
    return;
  }
  try {
    await axios.post('/api/calendars', {
      user_id: id,
      ...form.value,
    });

    router.push({ name: 'calendars' });
  } catch (error) {
    console.log(error);
  }
};
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
