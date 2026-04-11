<template>
  <!-- 거래 내역 수정 페이지 -->
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

    <DeleteConfirm 
    v-if="showModal"
    @left="showModal=false"
    @right="confirmDelete"
    />

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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';


const route = useRoute();
const router = useRouter();

// API에서 불러온 상세 데이터 저장
const expenseData = ref(null);

// 모달 열고 닫는 상태 변수
const showModal = ref(false);

// 페이지 진입 시 id로 상세 데이터 불러오기
onMounted( async() => {
  try {
    const response = await axios.get(`/api/expenses/${route.params.id}`);
    console.log('불러온 데이터 : ', response.data);
    expenseData.value = response.data;
  } catch (e) {
    console.error('데이터 불러오기 실패 : ', e);
  }
})


// 수정 페이지로 이동하기
const handleEdit = () => {
  router.push({ name: 'expenses/modify/id', params: { id: route.params.id } });
};

// 모달에서 '삭제' 버튼 클릭 시 -> 실제 삭제 실행
const confirmDelete = async() => {
  try {
    await axios.delete(`/api/expenses/${parseInt(route.params.id)}`);
    router.push({ name : 'expenses' });
  } catch (e) {
    console.error('삭제 : ', e)
  }
}

// 삭제 버튼 시 -> 모달만 열기
const handleDelete = () => {
  showModal.value = true;
};


</script>

<style scoped>

</style>
