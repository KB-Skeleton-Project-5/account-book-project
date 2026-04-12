<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 등록" :back="true" backTo="calendars" />
    </template>

    <div class="calendar-form-page">
      <div class="form-wrapper">

      <!-- 입력 폼 -->
      <CalendarForm
        :form="form"
        mode="input"
        @update:form="(val) => (form = val)"
      >
        <div class="button-area">
          <AppButton text="저장" @click="saveCalendar" />
        </div>
      </CalendarForm>
      </div>
      
    </div>

    <!-- ⭐ 추가: Alert 모달 -->
    <AlertModal
      v-if="showAlertModal"
      :message="alertMessage"
      @confirm="showAlertModal = false"
    />

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
import AlertModal from '@/components/commons/AlertModal.vue';
import { getUserInfo } from '@/util/authUtil';

const router = useRouter();
const userInfo = getUserInfo();

const today = new Date().toISOString().split('T')[0];
const savedDate = JSON.parse(sessionStorage.getItem('calendarSelectedDate'));

const form = ref({
  title: '',
  date: savedDate
    ? `${savedDate.year}-${String(savedDate.month).padStart(2, '0')}-${String(savedDate.day).padStart(2, '0')}`
    : today,
  time: '',
  expense_id: '',
  memo: '',
});

const showAlertModal = ref(false);
const alertMessage = ref('');

const saveCalendar = async () => {
  if (!userInfo || !userInfo.authenticated) {
    alertMessage.value = '로그인이 필요한 서비스입니다.';
    showAlertModal.value = true;
    return;
  }

  if (!form.value.title) {
    alertMessage.value = '제목을 입력해주세요.';
    showAlertModal.value = true;
    return;
  }
  if (!form.value.date) {
    alertMessage.value = '날짜를 선택해주세요.';
    showAlertModal.value = true;
    return;
  }
  try {
    await axios.post('/api/calendars', {
      user_id: userInfo.id,
      ...form.value,
    });

    // ⭐ 추가: 선택 날짜 저장
    const selected = new Date(form.value.date);

    sessionStorage.setItem(
      'calendarSelectedDate',
      JSON.stringify({
        year: selected.getFullYear(),
        month: selected.getMonth() + 1,
        day: selected.getDate(),
      }),
    );

    router.push({ name: 'calendars' });
  } catch (error) {
    alertMessage.value = '등록에 실패했습니다.';
    showAlertModal.value = true;
  }
};
</script>

<style scoped>
.calendar-form-page {
  padding: 20px 0;
  background-color: white;
  box-sizing: border-box;
  min-height: 100%;
}

.form-wrapper {
  width: calc(100% - 64px);
  max-width: 400px;
  margin: 0 auto;
}

.button-area {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

</style>
