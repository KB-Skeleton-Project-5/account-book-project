<template>
  <!-- 태그 선택 UI 영역 -->
  <div class="wrapper">
    <label>🏷️태그</label>
    <div class="tag-group">
      <button
        v-for="tag in tags"
        :key="tag.tagid"
        @click="handleSelect(tag)"
        :class="{ active: selected.tagid === tag.tagid }"
        class="tag-btn"
        :disabled="props.readonly"
      >
        {{ tag.tagtitle }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const tags = [
  { tagid: 'eat', tagtitle: '식비' },
  { tagid: 'traffic', tagtitle: '교통' },
  { tagid: 'shopping', tagtitle: '쇼핑' },
  { tagid: 'etc', tagtitle: '기타' },
];

const selected = ref(tags[3]); // 초기 값 기타로 변경
const emit = defineEmits(['submit-tag']);

const props = defineProps({
  value: [Object],
  readonly: Boolean,
});

watch(() => props.value, (val) => {
    // tagid가 있을 때만 세팅 (빈 객체가 기본값 덮어쓰는 것 방지)
    if(val?.tagid) selected.value = val;
}, { immediate : true });



const handleSelect = (tag) => {
  selected.value = tag
  emit('submit-tag', tag)
}

// 컴포넌트가 마운트 될 때 기본값(지출)을 부모에게 즉시 전달
onMounted(() => {
    emit('submit-tag', selected.value);
});
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 16px;
}
label {
  font-size: 0.9rem;
  color: #545045;
  min-width: 40px;
}
.tag-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tag-btn {
  padding: 6px 16px;
  border: 1px solid #ebebeb;
  border-radius: 20px;
  background-color: #ffffff;
  color: #9e9e9e;
  font-size: 0.85rem;
  cursor: pointer;
}
.tag-btn.active {
  background-color: #fcf2d0;
  color: #545045;
  border-color: #ffbc00;
}
</style>