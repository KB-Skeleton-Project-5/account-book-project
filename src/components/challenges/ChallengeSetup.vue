<template>
  <div class="challenge-setup">
    <select name="" id="">
      <option value="식비">식비</option>
      <option value="기타">기타</option>
    </select>

    <input type="text" />
    <span v-if="challengeType === '수입'">원 이상</span>
    <span v-else>원 이하</span>

    <select v-model="challengeType">
      <option value="수입">수입</option>
      <option value="지출">지출</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let challengeType = ref('지출');
</script>
