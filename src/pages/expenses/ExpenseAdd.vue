<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="지출 추가" />
    </template>

    <ExpenseForm />
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

const router = useRouter();

const handleSave = () => {
  router.push({ name: 'expenses' });
};
</script>

<style scoped>

</style>
