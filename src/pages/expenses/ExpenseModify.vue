<template>
    <DefaultLayout>
        <template #header>
            <AppHeader 
            title="수정" 
            :back="true" backTo="expenses/info/id"/>
        </template>
        <ExpenseForm 
        :initialData="expenseData"
        ref="expenseFormRef"
        @submit-form="handleSubmit"/>
        <AppButton 
        text="저장" 
        @click="handleSave" />

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
import { getExpense, updateExpenses } from '@/api/expenses';

const router = useRouter();
const route = useRoute();

const expenseData = ref(null);
const expenseFormRef = ref(null);

// 1. 페이지 들어오면 id로 데이터 불러오기
onMounted(async () => {
    const response = await getExpense(route.params.id);
    expenseData.value = response.data;
})

// 2. 저장 버튼 클릭 -> ExpenseForm한테 데이터 달라고 요청
const handleSave = () => {
    expenseFormRef.value.submitForm();
}

// 3. ExpenseForm에서 데이터 받으면 -> API 호출 후 목록으로 이동
const handleSubmit = async(data) => {
    await updateExpenses(route.params.id, data);
    router.push({name : 'expenses'});
}
</script>

<style scoped>

</style>