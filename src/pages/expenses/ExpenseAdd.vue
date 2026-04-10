<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="거래 내역 등록" :back="true" backTo="expenses"/>
    </template>

    <ExpenseForm ref="expenseFormRef" @submit-form="handleSubmit" />
    <AppButton text="저장" @click="handleSave" />

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
    console.log('저장 데이터 : ', formData);
    await axios.post('/api/expensesdb', {...formData, userId: userInfo.id})
    router.push({ name: 'expenses' })
  } catch (e) {
    console.error('저장 실패 : ', e); 
  }
};
</script>
