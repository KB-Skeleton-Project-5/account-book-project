<template>
  <div class="ChallengeDescription">
    <h5>
      {{ tag }}에서 {{ targetAmount }}만원
      {{ type === '수입' ? '이상' : '이하' }}
      {{ type }}
    </h5>
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
