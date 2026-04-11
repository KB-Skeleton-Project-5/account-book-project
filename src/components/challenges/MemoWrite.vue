<template>
  <div class="memo-write">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="챌린지 다짐 메모를 입력해주세요."
    ></textarea>
  </div>
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>

<style scoped>
.memo-write textarea {
  width: 100%;
  min-height: 120px;
  padding: 18px;
  border-radius: 14px;
  border: 1.5px solid #eef2f6;
  background-color: #f8fafc;
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  resize: none;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #ffcc00;
  box-shadow: 0 0 0 4px rgba(255, 204, 0, 0.15);
  transform: translateY(-2px);
}

textarea::placeholder {
  color: #94a3b8;
}
</style>
