<template>
  <!-- 거래 내역 등록 페이지 -->
  <DefaultLayout>
    <template #header>
      <AppHeader title="거래 내역 등록" :back="true" backTo="expenses"/>
    </template>

    <div class="add-container">
      <div class="expense-add-card">
        <ExpenseForm ref="expenseFormRef" @submit-form="handleSubmit" />
        <div class="add-action-buttons">
          <AppButton text="저장" @click="handleSave" />
        </div>
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import AppButton from '@/components/commons/AppButton.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil.js';

const userInfo = getUserInfo();

const router = useRouter();
const expenseFormRef = ref(null)

const handleSave = () => {
  expenseFormRef.value.submitForm()
}

const handleSubmit = async (formData) => {
  try{
    await axios.post('/api/expenses', {...formData, user_id: String(userInfo.id)})
    router.push({ name: 'expenses' })
  } catch (e) {
    console.error('저장 실패 : ', e);
  }
};
</script>

<style scoped>
.add-container {
  padding: 20px 0;
}

.expense-add-card {
  width: calc(100% - 40px);
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px 8px;
  margin: 0 auto;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.add-action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-right: 16px;
}
</style>