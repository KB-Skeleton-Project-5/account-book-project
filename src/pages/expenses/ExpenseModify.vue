<template>
    <!-- 거래 내역 수정 페이지 -->
    <DefaultLayout>
        <template #header>
            <AppHeader 
            title="수정" 
            :back="true" backTo="expenses/info/id"/>
        </template>

        <div class="add-container">
          <div class="expense-add-card">
            <ExpenseForm 
            :initialData="expenseData"
            ref="expenseFormRef"
            @submit-form="handleSubmit"/>
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
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import AppButton from '@/components/commons/AppButton.vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil.js';

const userInfo = getUserInfo();
const router = useRouter();
const route = useRoute();
const expenseData = ref(null);
const expenseFormRef = ref(null);

onMounted(async () => {
    try {
        const response = await axios.get(`/api/expenses/${route.params.id}`)
        expenseData.value = response.data
    } catch (e) {
        console.log('데이터 불러오기 실패 : ', e);
    }
})

const handleSave = () => {
    expenseFormRef.value.submitForm();
}

const handleSubmit = async(data) => {
    try {
        await axios.put(`/api/expenses/${route.params.id}`, {...data, user_id: String(userInfo.id)});
        router.push({ name : 'expenses' });
    } catch (e) {
        console.error('수정 실패 : ', e);
    }
}
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