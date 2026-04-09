<template>
    <!-- 금액 Input -->
    <div class="wrapper">
        <label>금액</label>
        <input type="number" v-model.number="amount" placeholder="0">
        <span>원</span>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const amount = ref('');
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
}
label {
    font-size: 0.9rem;
    color: #545045;
    min-width: 40px;
}
input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #EBEBEB;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #545045;
    outline: none;
}
input:focus {
    border-color: #FFBC00;
}
</style>