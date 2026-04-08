<template>
    <div class="wrapper">
        <label>메모</label>
        <textarea v-model="memo" placeholder="자세한 내용은 여기에 쓰세요."></textarea>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const memo = ref('');
</script>

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>