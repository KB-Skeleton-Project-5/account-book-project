<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="상세보기" :back="true" backTo="expenses"/>
    </template>

    <ExpenseForm />
    <AppButton type="edit-delete" @edit="handleEdit" @delete="handleDelete" />

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
import { deleteExpenses } from '@/api/expenses';

const route = useRoute();
const router = useRouter();

const handleEdit = () => {
  router.push({ name: 'expenses/modify/id', params: { id: route.params.id } });
};

const handleDelete = async() => {
  await deleteExpenses(route.params.id)  // <- id로 삭제
  router.push({ name: 'main' });        // 삭제 후 목록으로 이동
};
</script>

<style scoped>

</style>
