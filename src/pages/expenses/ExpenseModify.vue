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
import axios from 'axios';


const router = useRouter();
const route = useRoute();

const expenseData = ref(null);
const expenseFormRef = ref(null);


onMounted(async () => {
    try {
        const response = await axios.get(`/api/expensesdb/${route.params.id}`)
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
        await axios.put(`/api/expensesdb/${route.params.id}`, data);
        router.push({ name : 'expenses' });
    } catch (e) {
        console.error('수정 실패 : ', e);
    }
}
</script>

<style scoped>

</style>