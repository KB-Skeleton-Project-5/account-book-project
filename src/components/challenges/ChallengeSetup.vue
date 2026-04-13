<template>
  <div class="challenge-setup">
    <p>챌린지 제목</p>
    <input
      type="text"
      v-model="form.title"
      maxlength="20"
      placeholder="예: 4월 교통비 절약"
    />

    <p>챌린지 유형</p>
    <select v-model="form.type">
      <option value="지출">지출 챌린지 (아껴 쓰기)</option>
      <option value="수입">수입 챌린지 (돈 모으기)</option>
    </select>

    <p>카테고리 설정</p>
    <div class="tag-container">
      <select v-model="form.tag" class="tag-select">
        <option
          v-for="tag in availableTags"
          :key="tag.tagid"
          :value="tag.tagid"
        >
          {{ getTagTitle(tag.tagid, dbTags) }}
        </option>
      </select>
      <span class="suffix-label">에서</span>
    </div>

    <p>챌린지 금액</p>
    <div class="amount-container">
      <input
        type="number"
        v-model.number="form.targetAmount"
        @input="handleAmountInput"
        min="0"
        placeholder="0"
      />
      <span class="unit-label">
        만원 {{ form.type === '지출' ? '이하 지출' : '이상 수입' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { getTags } from '@/api/tags';
import { getTagTitle } from '@/util/tagUtil.js';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const dbTags = ref([]);

onMounted(async () => {
  try {
    const res = await getTags();
    dbTags.value = res.data;
  } catch (error) {
    console.error(error);
  }
});

const form = reactive({
  title: props.modelValue?.title?.substring(0, 20) || '',
  tag:
    props.modelValue?.tag === '전체' || !props.modelValue?.tag
      ? 'all'
      : props.modelValue.tag,
  targetAmount: props.modelValue?.targetAmount ?? 0,
  type: props.modelValue?.type || '지출',
});

const availableTags = computed(() => {
  const filtered = dbTags.value.filter((tag) => tag.type === form.type);
  return [{ tagid: 'all' }, ...filtered];
});

const handleAmountInput = (e) => {
  let val = e.target.value;
  val = val.replace(/[^0-9]/g, '');

  if (val.length > 1 && val.startsWith('0')) {
    val = val.replace(/^0+/, '');
  }

  form.targetAmount = val === '' ? 0 : parseInt(val, 10);
  e.target.value = val;
};

watch(
  () => form.type,
  () => {
    form.tag = 'all';
  },
);

watch(
  form,
  (newValue) => {
    if (newValue.title && newValue.title.length > 20) {
      newValue.title = newValue.title.substring(0, 20);
    }

    emit('update:modelValue', { ...newValue });
  },
  { deep: true, immediate: true },
);
</script>

<style scoped>
.challenge-setup {
  display: flex;
  flex-direction: column;
}

.challenge-setup p {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 12px;
  margin-bottom: 4px;
}

input[type='text'],
input[type='number'],
select {
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1.5px solid #eef2f6;
  background-color: #f8fafc;
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
}

.tag-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.tag-select {
  flex: 0 1 140px !important;
  margin-bottom: 0 !important;
}

.suffix-label,
.unit-label {
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  white-space: nowrap;
  display: inline-block;
  margin-bottom: 0;
}

.amount-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.amount-container input {
  flex: 1;
  margin-bottom: 0;
}

input:focus,
select:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #ffcc00;
  box-shadow: 0 0 0 4px rgba(255, 204, 0, 0.15);
  transform: translateY(-2px);
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px;
  padding-right: 45px;
}
</style>
