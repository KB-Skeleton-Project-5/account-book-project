<template>
    <div class="wrapper">
        <label>결제수단</label>
        <input v-model="payment" type="radio" name="payment" value="card">카드 &nbsp; &nbsp;
        <input v-model="payment" type="radio" name="payment" value="cash">현금
    </div>
</template>

<script setup>
import { ref } from 'vue';

const payment = ref('');
</script>

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>