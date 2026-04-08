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
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>