<template>
    <!-- 금액 입력 UI 영역 -->
    <!-- wrapper : 라벨 + 텍스트 영역을 묶어주는 박스 -->
    <div class="wrapper">
        <label>금액</label>
        <!-- v-model.number="amount" : amount 변수를 양방향 바인딩 -->
        <!-- :readonly="props.readonly" 
            부모 컴포넌트에서 readonly를 true로 보내서 읽기 전용
            false면 입력 가능
        -->
        <input 
        type="number" 
        v-model.number="amount" 
        placeholder="0"
        :readonly="props.readonly"
        @input="preventInvalidInput">
        <span>원</span>
    </div>
</template>

<script setup>
// watch : 특정 값을 감시하다가 바뀌면 함수 실행
import { ref, watch } from 'vue';

const amount = ref('');

const emit = defineEmits(['submit-amount']);

// 왜 value에 Number, String 둘다?
// 답변 : 서버나 DB에서 문자열로 넘어올수도, 숫자로 넘어올 수 있어 안전하게
const props = defineProps({
    value : [ Number, String ],
    // true면 입력 불가, false면 입력 가능 (true/false는 Boolean 즉 논리형)
    readonly : Boolean,
});


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

// props.value를 계속 지켜보고 있음
watch(() => props.value, (val) => {
    // 새로운 값(val) 이 들어오면 내부 amount에 값 넣기
    if(val) amount.value = val;
    // val이 0이면 falsy값이라서 if(val)을 통과 못시킴. 
    // val에 값이 있을 때만 amount에 넣어줌.
}, { immediate : true });
// 컴포넌트가 처음 생성될 때 바로 실행
// 만약에 이거 없으면 빈값으로 뜨고 값이 바뀔 때만 실행되서 초기 데이터가 안 뜰수도,,
// true로 설정하면 컴포넌트 생성되자마자 watch를 즉시 실행


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
input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #EBEBEB;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #545045;
    outline: none;
}
input:focus {
    border-color: #FFBC00;
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