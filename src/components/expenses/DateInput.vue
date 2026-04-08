<template>
    <!-- 날짜 Input 태그 -->
    <div class="wrapper">
        <label>날짜</label>
        <input type="date" v-model="date">
    </div>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date().toISOString().split('T')[0]);
/// new Date().toISOString().split('T')[0]는 JS에서 현재 날짜를 YYYY-MM-DD 형식
</script>

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>