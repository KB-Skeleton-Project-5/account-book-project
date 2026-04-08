<template>
    <div class="wrapper">
        <div class="header">
            <span>상세보기</span>
        </div>
        <ExpenseForm />
        <AppButton type="edit-delete" @edit="handleEdit" @delete="handleDelete" />
    </div>
</template>

<script setup>
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import AppButton from '@/components/commons/AppButton.vue'

const handleEdit = () => {
    console.log('수정 클릭!')
}

const handleDelete = () => {
    console.log('삭제 클릭!')
}
</script>

<style scoped>
.wrapper {
    width: 100%;
    max-width: 390px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
}

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    font-size: 1rem;
    font-weight: 600;
    color: #545045;
    border-bottom: 1px solid #EBEBEB;
}
</style>