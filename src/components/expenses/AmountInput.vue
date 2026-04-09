<template>
    <!-- 금액 Input -->
    <div class="wrapper">
        <label>금액</label>
        <input type="number" v-model.number="amount" @input="handleInput" placeholder="0">
        <span>원</span>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const amount = ref('');
const emit = defineEmits(['submit-amount']);

const props = defineProps({
    value : [ Number, String ]
});

// props.value를 계속 지켜보고 있음
watch(() => props.value, (val) => {
    // 새로운 값(val) 이 들어오면 내부 amount에 값 넣기
    if(val !== undefined) amount.value = val;
    // 컴포넌트가 처음 생성될 때 바로 실행
    // 만약에 이거 없으면 빈값으로 뜨고 값이 바뀔 때만 실행되서 초기 데이터가 안 뜰수도,,
    // 즉시 실행?하는 느낌
}, { imediate : true });

const handleInput = () => {
    // ref는 value,,
    emit('submit-amount', amount.value)
}
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
</style>