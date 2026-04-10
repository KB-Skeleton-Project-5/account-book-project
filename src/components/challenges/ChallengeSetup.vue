<template>
  <div class="challenge-setup">
    <input type="text" v-model="form.title" placeholder="새 목표" />

    <div>
      <select v-model="form.tag">
        <option v-for="tag in availableTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
      <span>에서</span>
    </div>

    <input type="number" v-model.number="form.targetAmount" />
    <span>만원 {{ form.type === '수입' ? '이상' : '이하' }}</span>

    <select v-model="form.type">
      <option value="수입">수입</option>
      <option value="지출">지출</option>
    </select>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const tagsByType = {
  지출: ['식비', '쇼핑', '교통비', '문화생활', '기타'],
  수입: ['월급', '투자수익', '부업', '기타'],
};

const form = reactive({
  title: props.modelValue?.title || '',
  tag: props.modelValue?.tag || '식비',
  targetAmount: props.modelValue?.targetAmount || 0,
  type: props.modelValue?.type || '지출',
});

const availableTags = computed(() => {
  return tagsByType[form.type] || [];
});

watch(
  () => form.type,
  (newType) => {
    form.tag = tagsByType[newType][0];
  },
);

watch(
  form,
  (newValue) => {
    emit('update:modelValue', { ...newValue });
  },
  { deep: true, immediate: true },
);
</script>
