<template>
  <div class="memo-display">
    <p>{{ memo }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const memo = ref('여기는 메모입니다.');
</script>

<style scoped>
p {
  border-radius: 12px;
  background-color: #555555;
  padding: 20px;
  color: white;
}
</style>
