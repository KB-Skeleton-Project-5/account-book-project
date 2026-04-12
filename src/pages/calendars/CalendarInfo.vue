<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 상세 조회" :back="true" backTo="calendars" />
    </template>

    <div class="calendar-form-page">
      <div class="form-wrapper">
        <CalendarForm v-if="form" :form="form" mode="value">
            <AppButton
              type="edit-delete"
              @edit="handleEdit"
              @delete="handleDelete"
              style="margin-top: 16px;"
            />
        </CalendarForm>
      </div>
    </div>

    <!-- 삭제 모달 -->
    <DeleteConfirm
      v-if="showDeleteModal"
      @left="showDeleteModal = false"
      @right="confirmDelete"
    />

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
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';
import AlertModal from '@/components/commons/AlertModal.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const router = useRouter();
const route = useRoute();

const form = ref(null);
const showDeleteModal = ref(false);
const showAlertModal = ref(false); 
const alertMessage = ref('');

const handleEdit = () => {
  router.push({ name: 'calendars/modify', params: { id: route.params.id } });
};

const handleDelete = () => {
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await axios.delete(`/api/calendars/${route.params.id}`);
    router.push({ name: 'calendars' });
  } catch (error) {
     alertMessage.value = '삭제에 실패했습니다.';
     showAlertModal.value = true;
  }
};

const fetchCalendar = async () => {
  try {
    const res = await axios.get(`/api/calendars/${route.params.id}`);
    form.value = res.data;

  } catch (error) {
     alertMessage.value = '데이터를 불러오는데 실패했습니다.';
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

</style>
