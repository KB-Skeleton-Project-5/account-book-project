<template>
    <DefaultLayout>
        <template #header>
            <AppHeader title="수정" :back="true" backTo="expenses/info/id"/>
        </template>
        <ExpenseForm />
        <AppButton text="저장" @click="handleSave" />

        <template #footer>
            <AppFooter />
        </template>
    </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import AppButton from '@/components/commons/AppButton.vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const router = useRouter();

const handleSave = () => {
    router.push({ name : 'expenses' });
}
</script>

<style scoped>

</style>