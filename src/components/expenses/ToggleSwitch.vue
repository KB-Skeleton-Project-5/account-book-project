<template>
    <!-- 고정 지출 여부 -->
    <div class="wrapper">
        <label>고정 지출 등록</label>
        <input type="checkbox" v-model="isFixed">
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isFixed = ref(false);
</script>

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>