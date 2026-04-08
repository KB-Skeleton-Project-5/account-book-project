<template>
    <div class="wrapper">
        수정
        <ExpenseForm />
        <!-- 공통 컴포넌트 저장 버튼 들어가야함. -->
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