<template>
  <DefaultLayout>
    <template #header>
      <AppHeader 
      title="상세보기" 
      :back="true" backTo="expenses"/>
    </template>

    <!-- initialData로 불러온 데이터를 ExpenseForm에 전달 -->
    <ExpenseForm 
    :initialData="expenseData"
    :readonly="true"/>
    <AppButton 
    type="edit-delete" 
    @edit="handleEdit" 
    @delete="handleDelete" />

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
import { getExpense, deleteExpenses } from '@/api/expenses';
import { ref, onMounted } from 'vue';


const route = useRoute();
const router = useRouter();

// API에서 불러온 상세 데이터 저장
const expenseData = ref(null);

// 페이지 진입 시 id로 상세 데이터 불러오기
onMounted(async() => {
  const response = await getExpense(route.params.id);
  // console.log('불러온 데이터 : ', response.data);
  expenseData.value = response.data;
})


// 수정 페이지로 이동하기
const handleEdit = () => {
  router.push({ name: 'expenses/modify/id', params: { id: route.params.id } });
};


// 일단 삭제 후 메인으로 이동 (삭제 모달 달기 전)
const handleDelete = async() => {
  await deleteExpenses(route.params.id)  // <- id로 삭제
  router.push({ name: 'main' });        // 삭제 후 목록으로 이동
};


</script>

<style scoped>

</style>
