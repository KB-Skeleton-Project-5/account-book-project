<template>
  <div class="challenge-setup">
    <p>목표 제목</p>
    <input type="text" v-model="form.title" placeholder="예: 4월 교통비 절약" />

    <p>챌린지 유형</p>
    <select v-model="form.type">
      <option value="지출">지출 챌린지 (아껴 쓰기)</option>
      <option value="수입">수입 챌린지 (돈 모으기)</option>
    </select>

    <p>목표 금액</p>
    <div class="amount-container">
      <input type="number" v-model="form.targetAmount" placeholder="0" />
      <span class="unit-label">
        만원 {{ form.type === '지출' ? '이하 지출' : '이상 수입' }}
      </span>
    </div>

    <p>카테고리 설정</p>
    <div class="tag-container">
      <select v-model="form.tag">
        <option v-for="tag in availableTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
      <span class="suffix-label">에서</span>
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
  수입: ['전체', '월급', '투자', '부업', '기타'],
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
/* 1. 입력 및 선택 그룹 컨테이너 */
.challenge-setup {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 요소들 사이의 간격을 일정하게 */
}

/* 2. 입력창과 선택창 공통 - '조약돌' 스타일 */
input[type='text'],
input[type='number'],
select {
  width: 100%;
  padding: 16px 20px; /* 더 시원시원한 내부 여백 */
  margin-top: 8px;
  margin-bottom: 20px;

  border-radius: 14px; /* 더 둥글고 부드럽게 */
  border: 1.5px solid #eef2f6; /* 거의 보이지 않을 정도로 연한 테두리 */
  background-color: #f8fafc; /* 눈이 편안한 미세 회색 배경 */

  font-size: 16px;
  font-weight: 500;
  color: #334155; /* 세련된 슬레이트 그레이 */

  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 쫀득한 애니메이션 */
  appearance: none; /* 브라우저 기본 스타일 제거 (특히 select) */
}

/* 3. 마우스를 올렸을 때 (Hover) */
input[type='text']:hover,
select:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

/* 4. 💡 [최신식 핵심] 클릭(Focus) 시 '헤일로' 효과 */
input[type='text']:focus,
select:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #ffcc00; /* 앱의 메인 컬러 */

  /* 부드럽게 퍼지는 노란색 광채 효과 */
  box-shadow: 0 0 0 4px rgba(255, 204, 0, 0.15);

  /* 살짝 위로 떠오르는 인터랙션 */
  transform: translateY(-2px);
}

/* 5. 선택창(Select) 전용 디자인 */
select {
  cursor: pointer;
  /* 화살표 아이콘을 직접 넣고 싶다면 배경 이미지로 추가 가능 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px;
  padding-right: 45px;
}

/* 6. 레이블 글자 ('에서', '만원 이하' 등) */
.challenge-setup span {
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  margin-left: 2px;
  display: block;
  margin-bottom: 4px;
}

/* 금액 입력 부분 정렬 */
.amount-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.amount-container input {
  flex: 1;
}
</style>
