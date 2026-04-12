<template>
  <!-- 거래 내역 수정 페이지 -->
  <DefaultLayout>
    <template #header>
      <AppHeader 
      title="상세보기" 
      :back="true" backTo="expenses"/>
    </template>

    <div class="info-container">
      <div class="expense-info-card">
        <ExpenseForm 
        :initialData="expenseData"
        :readonly="true"/>
        <div class="action-buttons">
          <AppButton 
          type="edit-delete" 
          @edit="handleEdit" 
          @delete="handleDelete" 
          class="full-width"/>
        </div>
      </div>
    </div>

    <DeleteConfirm 
    v-if="showModal"
    @left="showModal=false"
    @right="confirmDelete"
    />

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import { useRoute, useRouter } from 'vue-router';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';
import AppButton from '@/components/commons/AppButton.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';

const route = useRoute();
const router = useRouter();

const expenseData = ref(null);
const showModal = ref(false);

onMounted( async() => {
  try {
    const response = await axios.get(`/api/expenses/${route.params.id}`);
    console.log('불러온 데이터 : ', response.data);
    expenseData.value = response.data;
  } catch (e) {
    console.error('데이터 불러오기 실패 : ', e);
  }
})

const handleEdit = () => {
  router.push({ name: 'expenses/modify/id', params: { id: route.params.id } });
};

const confirmDelete = async() => {
  try {
    await axios.delete(`/api/expenses/${parseInt(route.params.id)}`);
    router.push({ name : 'expenses' });
  } catch (e) {
    console.error('삭제 : ', e)
  }
}

const handleDelete = () => {
  showModal.value = true;
};
</script>

<style scoped>
.info-container {
  padding: 20px 0;
}

.expense-info-card {
  width: calc(100% - 40px);
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px 8px;
  margin: 0 auto;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.action-buttons {
  margin-top: 16px;
  padding: 0 16px;
}

.full-width :deep(.btn-group) {
  width: 100%;
}
</style>