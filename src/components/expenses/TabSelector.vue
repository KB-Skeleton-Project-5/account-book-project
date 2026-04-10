<template>
  <!-- 수입/지출 분류 탭 UI 영역 -->
  <div class="wrapper">
    <label>📂 분류</label>
    <div class="tab-group">
      <button
        v-for="tab in tabs"
        :key="tab.typeid"
        @click="handleSelect(tab)"
        :class="{ active: selected.typeid === tab.typeid }"
        class="tab-btn"
        :disabled="props.readonly"
      >
        {{ tab.typetitle }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const tabs = [
  { typeid: 'deposit', typetitle: '수입' },
  { typeid: 'withdrawal', typetitle: '지출' }
]

const props = defineProps({
    value : [ Object ],
    readonly : Boolean,
});

// tabs[1]은 배열의 두 번째 항목 즉, 기본값 '지출'
const selected = ref(tabs[1]); 
const emit = defineEmits(['submit-tab']);

watch(() => props.value, (val) => {
    // val 이 빈 객체가 아닐 때만(typeid가 있을 때만) 세팅
    if(val?.typeid) selected.value = val;
}, { immediate : true });



const handleSelect = (tab) => {
  selected.value = tab
  emit('submit-tab', tab)
}

onMounted(() => {
  emit('submit-tab', selected.value);
});
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