<template>
    <!-- 제목(내역) Input -->
    <div class="wrapper">
        <label>제목</label>
        <input type="text" v-model="title">
    </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('')
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