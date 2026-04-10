<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 상세 조회" :back="true" backTo="calendars" />
    </template>

    <div class="calendar-form-page">
      <div class="page-top-space"></div>

      <CalendarForm v-if="form" :form="form" mode="value">
        <div class="button-area">
          <AppButton
            type="edit-delete"
            @edit="handleEdit"
            @delete="handleDelete"
          />
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import AppButton from '@/components/commons/AppButton.vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const router = useRouter();
const route = useRoute();

const form = ref(null);

const handleEdit = () => {
  router.push({ name: 'calendars/modify', params: { id: route.params.id } });
};

const handleDelete = async () => {
  // TODO : 삭제 모달 연결 예정
  // 우선 삭제 버튼 누르면 삭제되는걸로
  try {
    // ❗️오류 수정: /api/뒤에 calendars 추가
    await axios.delete(`/api/calendarsdb/${route.params.id}`); //id로 삭제
    console.log('삭제 완료');
    router.push({ name: 'calendars' }); 
  } catch (error) {
    console.log('삭제 실패',error);
  }
};

const fetchCalendar = async () => {
  try {
    const res = await axios.get(
      `/api/calendarsdb/${route.params.id}`,
    );

    form.value = res.data;

    console.log(form.value);
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  fetchCalendar();
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
