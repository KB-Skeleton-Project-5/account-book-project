<template>
  <div class="modal-overlay">
    <div class="modal-box">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>

      <div class="modal-buttons">
        <button class="btn-right" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '입력 확인' },
  message: { type: String, default: '필수 항목을 모두 입력해주세요.' },
  confirmText: { type: String, default: '확인' },
});

defineEmits(['confirm']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background-color: white;
  padding: 30px;
  border-radius: 16px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.modal-box h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #333;
}
.modal-box p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.modal-buttons button {
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.btn-left {
  background-color: white;
  color: #333;
  border: 1px solid #ddd !important;
}

.btn-right {
  background-color: #ffbc00;
  color: black;
}
</style>