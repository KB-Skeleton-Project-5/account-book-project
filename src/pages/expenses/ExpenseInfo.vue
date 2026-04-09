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

const route = useRoute();
const router = useRouter();

const handleEdit = () => {
  router.push({ name: 'expenses/modify/id', params: { id: route.params.id } });
};

const handleDelete = () => {
  // TODO : 삭제 모달 연결 예정
  // 아직은 메인 페이지로 이동
  router.push({ name: 'main' });
};
</script>

<style scoped>

</style>
