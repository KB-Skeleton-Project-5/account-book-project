<template>
  <div v-if="modelValue" class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header-area">
        <div class="icon-circle">⚠️</div>
        <p class="modal-title">입력 확인</p>
      </div>
      <p class="modal-body-text">{{ message }}</p>
      <div class="modal-footer-area">
        <button @click="$emit('update:modelValue', false)">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,  // v-model로 열고 닫기
  message: String,      // 표시할 메시지
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 320px;
}
.modal-header-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FAEEDA;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-title {
  font-weight: 500;
  font-size: 15px;
  margin: 0;
}
.modal-body-text {
  font-size: 14px;
  color: #666;
  margin: 0 0 1.25rem;
}
.modal-footer-area {
  display: flex;
  justify-content: flex-end;
}
.modal-footer-area button {
  background: #185FA5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
}
</style>