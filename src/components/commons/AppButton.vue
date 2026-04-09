<template>
  <!-- 수정/삭제 그룹 (양쪽 배치) -->
  <div v-if="type === 'edit-delete'" class="btn-group">
    <button class="app-btn" @click="$emit('edit')">{{ leftText }}</button>
    <button class="app-btn btn-delete" @click="$emit('delete')">삭제</button>
  </div>

  <!-- 단일 버튼 (오른쪽 배치) -->
  <div v-else class="btn-wrapper">
    <button class="app-btn" @click="$emit('click')">{{ text }}</button>
  </div>
</template>

<script setup>
defineProps({
  // 단일 버튼 텍스트 (저장, 수정, 로그아웃 등)
  text: {
    type: String,
    default: '저장',
  },
  leftText: { type: String, default: '수정' },
  // 'edit-delete' 로 넣으면 수정/삭제 그룹으로 표시
  type: {
    type: String,
    default: 'single',
  },
});

defineEmits(['click', 'edit', 'delete']);
</script>

<style scoped>
/* 단일 버튼 - 오른쪽 배치 */
.btn-wrapper {
  display: flex;
  justify-content: flex-end;
}

/* 수정/삭제 그룹 - 양쪽 배치 */
.btn-group {
  display: flex;
  justify-content: space-between;
}

.app-btn {
  background-color: #ffcc00;
  color: #545045;
  border: none;
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.app-btn:hover {
  background-color: #e6b800;
}

.btn-delete {
  background-color: #e57373;
  color: #ffffff;
}

.btn-delete:hover {
  background-color: #c62828;
}
</style>
