<template>
  <!-- 수입, 지출, 이체 탭 -->
  <div class="wrapper">
    <label>분류</label>
    <div class="tab-group">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="handleSelect(tab)"
        :class="{ active : selected === tab }"
        class="tab-btn"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selected = ref('지출');
const tabs = ['수입', '지출', '이체'];
const emit = defineEmits(['submit-tab']);

const handleSelect = (tab) => {
    selected.value = tab
    emit('submit-tab', tab)
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
}
label {
    font-size: 0.9rem;
    color: #545045;
    min-width: 40px;
}
.tab-group {
    display: flex;
    gap: 8px;
}
.tab-btn {
    padding: 6px 16px;
    border: 1px solid #EBEBEB;
    border-radius: 20px;
    background-color: #ffffff;
    color: #9e9e9e;
    font-size: 0.85rem;
    cursor: pointer;
}
.tab-btn.active {
    background-color: #FCF2D0;
    color: #545045;
    border-color: #FFBC00;
}
</style>