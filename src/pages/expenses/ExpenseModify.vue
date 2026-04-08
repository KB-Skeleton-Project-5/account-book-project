<template>
    <div class="wrapper">
        <div class="header">
            <span>수정</span>
        </div>
        <ExpenseForm />
        <AppButton text="저장" @click="handleSave" />
    </div>
</template>

<script setup>
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import AppButton from '@/components/commons/AppButton.vue'

const handleSave = () => {
    console.log('저장 클릭!')
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