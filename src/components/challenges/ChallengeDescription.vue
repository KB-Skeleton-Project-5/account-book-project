<template>
  <div class="ChallengeDescription">
    <h3>{{ tag }}에서 {{ targetAmount }}만원 이하 {{ type }}하기</h3>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  tag: {
    type: String,
    default: '식비',
  },
  targetAmount: {
    type: Number,
    default: 50,
  },
  type: {
    type: String,
    default: '지출',
  },
});
</script>
