<template>
  <div class="challenge-setup">
    <input type="text" v-model="form.challengeName" placeholder="새 목표 1" />
    <div>
      <select v-model="form.tag">
        <option value="식비">식비</option>
        <option value="기타">기타</option>
      </select>
      <span>에서</span>
    </div>

    <input type="number" v-model="form.targetAmount" />
    <span>만원 {{ form.type === '수입' ? '이상' : '이하' }}</span>

    <select v-model="form.type">
      <option value="수입">수입</option>
      <option value="지출">지출</option>
    </select>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const form = reactive({
  challengeName: props.modelValue?.challengeName || '',
  tag: props.modelValue?.tag || '식비',
  targetAmount: props.modelValue?.targetAmount || 0,
  type: props.modelValue?.type || '지출',
});

watch(
  form,
  (newValue) => {
    emit('update:modelValue', { ...newValue });
  },
  { deep: true },
);
</script>
