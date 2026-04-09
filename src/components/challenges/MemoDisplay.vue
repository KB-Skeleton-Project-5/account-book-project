<template>
  <div class="memo-display">
    <p>{{ memo || '등록된 메모가 없습니다.' }}</p>
  </div>
</template>

<script setup>
defineProps({
  memo: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
p {
  border-radius: 12px;
  background-color: #555555;
  padding: 20px;
  color: white;
}
</style>
