<template>
    <!-- 금액 Input -->
    <div class="wrapper">
        <label>금액</label>
        <input type="number" v-model.number="amount">원
    </div>
</template>

<script setup>
import { ref } from 'vue';

const amount = ref('');
</script>

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>