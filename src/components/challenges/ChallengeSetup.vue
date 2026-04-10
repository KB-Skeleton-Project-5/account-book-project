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

    <div class="amount-container">
      <input
        type="text"
        :value="form.targetAmount"
        @input="validateAmount"
        placeholder="0"
      />
      <span>만원 {{ form.type === '수입' ? '이상' : '이하' }}</span>
    </div>

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
input[type='text'],
input[type='number'],
select {
  width: 100%; /* 칸을 가로로 꽉 채워서 시원하게 만듭니다 */
  padding: 12px 14px; /* 글씨와 상자 테두리 사이의 여백을 줘서 숨통을 틔웁니다 */
  margin-top: 8px; /* 위쪽 글씨와의 간격 */
  margin-bottom: 16px; /* 아래쪽 요소와의 간격 */

  /* 💡 여기가 핵심! 딱딱한 모서리를 둥글게 깎아줍니다 */
  border-radius: 8px;

  /* 테두리를 아주 부드러운 연회색으로 바꿉니다 */
  border: 1px solid #e0e0e0;

  /* 배경색을 메모장처럼 아주 약간의 회색빛이 도는 흰색으로 설정 (원치 않으시면 지워도 됩니다) */
  background-color: #fafafa;

  font-size: 15px;
  color: #333;
  box-sizing: border-box; /* 패딩이 너비를 뚫고 나가지 않게 고정 */
  transition: all 0.2s ease; /* 눌렀을 때 부드럽게 변하는 애니메이션 */
}

/* 2. 입력창을 클릭(포커스)했을 때의 예쁜 효과 */
input[type='text']:focus,
input[type='number']:focus,
select:focus {
  outline: none; /* 못생긴 기본 파란색 테두리 제거 */
  border-color: #ffcc00; /* 클릭하면 테두리가 앱의 메인 컬러(노란색)로 바뀝니다! */
  background-color: #ffffff; /* 클릭하면 배경이 완전한 하얀색으로 밝아집니다 */
}

/* 3. '에서', '만원 이하', '지출' 같은 글자들을 예쁘게 정렬하기 위한 팁 */
/* 만약 입력칸과 글자가 한 줄에 있다면, 그 줄을 감싸는 div에 아래 클래스를 줘보세요 */
.input-row {
  display: flex;
  align-items: center; /* 입력칸과 글자의 높낮이를 중앙으로 맞춰줍니다 */
  gap: 10px; /* 칸과 글자 사이의 간격 */
}
</style>
