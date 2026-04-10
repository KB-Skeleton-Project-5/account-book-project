<template>
  <div class="challenge-setup">
    <p>목표 제목</p>
    <input type="text" v-model="form.title" placeholder="예: 4월 교통비 절약" />

    <p>챌린지 유형</p>
    <select v-model="form.type">
      <option value="지출">지출 챌린지 (아껴 쓰기)</option>
      <option value="수입">수입 챌린지 (돈 모으기)</option>
    </select>

    <p>카테고리 설정</p>
    <div class="tag-container">
      <select v-model="form.tag" class="tag-select">
        <option v-for="tag in availableTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
      <span class="suffix-label">에서</span>
    </div>

    <p>목표 금액</p>
    <div class="amount-container">
      <input type="number" v-model="form.targetAmount" placeholder="0" />
      <span class="unit-label">
        만원 {{ form.type === '지출' ? '이하 지출' : '이상 수입' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// 태그 데이터 구성
const tagsByType = {
  지출: ['전체', '식비', '쇼핑', '교통비', '기타'],
  수입: ['전체', '급여', '투자', '부업', '기타'],
};

// 폼 데이터 초기화
const form = reactive({
  title: props.modelValue?.title || '',
  tag: props.modelValue?.tag || '식비',
  targetAmount: props.modelValue?.targetAmount ?? 0,
  type: props.modelValue?.type || '지출',
});

const validateAmount = (e) => {
  const filteredValue = e.target.value.replace(/[^0-9]/g, '');

  e.target.value = filteredValue;

  form.targetAmount = filteredValue === '' ? 0 : Number(filteredValue);
};

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

<style scoped>
/* 1. 전체 컨테이너 및 라벨 (기존 유지) */
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

/* 2. 공통 입력창 스타일 (조약돌 디자인 유지) */
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

/* 3. 🎯 [수정 핵심] 카테고리 설정창 너비 조절 */
.tag-container {
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 10px;
  margin-bottom: 8px;
}

.tag-select {
  flex: 0 1 140px !important; /* 💡 가로 너비를 최대 140px로 제한하여 '에서' 공간 확보 */
  margin-bottom: 0 !important; /* 컨테이너 내부 마진 제거 */
}

/* 4. 🎯 [수정 핵심] '에서', '만원 이하' 글자 정렬 */
.suffix-label,
.unit-label {
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  white-space: nowrap; /* 💡 절대 줄바꿈 되지 않게 고정 */
  display: inline-block; /* 💡 block을 제거하여 가로 배치 허용 */
  margin-bottom: 0;
}

/* 5. 금액 컨테이너 (기존 유지) */
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

/* Focus & Hover 효과 (기존 유지) */
input:focus,
select:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #ffcc00;
  box-shadow: 0 0 0 4px rgba(255, 204, 0, 0.15);
  transform: translateY(-2px);
}

/* 화살표 아이콘 (기존 유지) */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px;
  padding-right: 45px;
}
</style>
