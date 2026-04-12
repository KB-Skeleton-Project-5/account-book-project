<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 수정" :back="true" backTo="calendars/info" />
    </template>

    <div class="calendar-form-page">
      <div class="form-wrapper">
        <CalendarForm
          v-if="form"
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import AppButton from '@/components/commons/AppButton.vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import AlertModal from '@/components/commons/AlertModal.vue';

const route = useRoute();
const router = useRouter();

const form = ref(null);
const showAlertModal = ref(false);
const alertMessage = ref('');

const fetchCalendar = async () => {
  try {
    const res = await axios.get(`/api/calendars/${route.params.id}`);
    form.value = res.data;
  } catch (error) {
    alertMessage.value = '데이터를 불러오는데 실패했습니다.';
    showAlertModal.value = true;
  }
};

const saveCalendar = async () => {
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
    await axios.put(`/api/calendars/${route.params.id}`, form.value);
    router.push({ name: 'calendars' });
  } catch (error) {
     alertMessage.value = '수정에 실패했습니다.';
     showAlertModal.value = true;
  }
};

onMounted(() => {
  fetchCalendar();
});
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
