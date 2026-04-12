<template>
  <div class="form-card">
    <div class="wrapper">
      <label>제목</label>

      <input v-if="mode === 'input'" type="text" v-model="form.title" />

      <div v-else class="value-box">
        {{ form.title }}
      </div>
    </div>

    <div class="wrapper">
      <label>날짜</label>

      <input v-if="mode === 'input'" type="date" v-model="form.date" />

      <div v-else class="value-box">
        {{ form.date }}
      </div>
    </div>

    <div class="wrapper">
      <div class="label-row">
        <label>시간</label>
        <button
          v-if="form.time && mode === 'input'"
          type="button"
          class="clear-btn"
          @click="clearTime"
        >
          ✕
        </button>
      </div>

      <div v-if="mode === 'input'" class="input-with-clear">
        <input type="time" v-model="form.time" />
      </div>

      <div v-else class="value-box">
        {{ form.time }}
      </div>
    </div>

    <div class="wrapper">
      <label>입출금내역</label>

      <div v-if="mode === 'input'" class="amount-input-wrapper">
        <input 
          type="number" 
          v-model="form.expenseId" 
          placeholder="금액을 입력해주세요."
          @input="preventInvalidInput"
        />
        <span class="unit">원</span>
      </div>
      <div v-else class="value-box">
        {{ form.expenseId }}
      </div>
    </div>

    <div class="wrapper">
      <label>메모</label>

      <textarea v-if="mode === 'input'" 
      v-model="form.memo" 
      placeholder="일정 메모를 입력해주세요."></textarea>

      <div v-else class="value-box textarea-value">
        {{ form.memo }}
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { toRefs } from 'vue';

const emit = defineEmits(['update:form']);

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },

  mode: {
    type: String,
    default: 'input', // input | value
  },
});

const { form, mode } = toRefs(props);

const clearTime = () => {
  emit('update:form', { ...props.form, time: '' });
  console.log('clearTime 실행됨'); // 이거 추가해서 함수 실행되는지 확인

};

const preventInvalidInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    /* replace(/[^0-9]/g, '') 
        - 정규식(regex)으로 값 필터링
        - [^0-9] : 0~9 숫자가 아닌 모든 문자를 의미
        - g : 해당되는 것을 전부 다 찾아서 바꾸겠다는 옵션
        - '' : 찾은 것들을 빈 문자열로 교체 (ex. "abc12한글" -> "12")
    */
    // 필터링 된 값을 부모에 전달
    emit('submit-amount', Number(e.target.value));
};
</script>

<style scoped>
.form-card {
  background-color: white;
  border-radius: 14px;
  padding: 22px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 20px;
}

.wrapper label {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label-row label {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #888;
  padding: 0;
  margin-right: 11px; /* input 오른쪽 끝이랑 맞게 조절 */
}

.wrapper input,
 .wrapper textarea {
  width: 100%;
  height: auto;
  background-color: #f8fafc;
  border: 1.5px solid #eef2f6;
  border-radius: 14px;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
}

.wrapper textarea {
  min-height: 100px;
  resize: none;
}

.wrapper input:focus,
.wrapper textarea:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #ffcc00;
  box-shadow: 0 0 0 4px rgba(255, 204, 0, 0.15);
  transform: translateY(-2px);
}

/* info용 */

.value-box {
  width: 100%;
  min-height: 44px;
  background-color: #f3f3f3;
  border: 1.5px solid #eef2f6;
  border-radius: 14px;
  padding: 14px 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #334155;
}

.textarea-value {
  min-height: 100px;
  align-items: flex-start;
}

.input-with-clear {
  width: 100%;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-input-wrapper input {
  flex: 1;
}

.unit {
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
}

/* 그 외(Chrome, Safari, Edge...)의 브라우저용 사용자 정의 스타일 */
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
