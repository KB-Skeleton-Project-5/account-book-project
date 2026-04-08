<template>
    <div class="wrapper">
        상세보기
        <ExpenseForm />
        <!-- 공통 컴포넌트 수정,삭제 버튼 들어가야함. -->
    </div>
</template>

<script setup>
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';


</script>

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>