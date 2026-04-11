<template>
  <div class="memo-display-container">
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
.memo-display-container p {
  border-radius: 12px;
  background-color: #f8fafc;
  padding: 20px;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
