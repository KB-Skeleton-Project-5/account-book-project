<template>
    <!-- 결제수단 선택 UI 영역 -->
    <div class="wrapper">
        <label>결제수단</label>
        <!-- radio-group : 라디오 버튼 여러개 묶어주는 박스 -->
        <div class="radio-group">
            <!-- radio-label : 라디오 버튼 + 텍스트를 함께 묶은 label -->
            <label class="radio-label">
                <input 
                v-model="payment" 
                type="radio" 
                name="payment" 
                value="카드"
                @change="handleChange"
                :disabled="props.readonly">
                <span>카드</span>
            </label>
            <label class="radio-label">
                <input 
                v-model="payment" 
                type="radio" 
                name="payment" 
                value="현금"
                @change="handleChange"
                :disabled="props.readonly">
                <!-- 라디오 버튼은 readonly 속성을 지원하지 않아서 disabled 사용 -->
                <span>현금</span>
            </label>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    value : [ String ],
    readonly: Boolean,
});

watch(() => props.value, (val) => {
    if(val) payment.value = val;
}, { immediate : true });

const payment = ref('카드');
const emit = defineEmits(['submit-payment']);

const handleChange = () => {
    emit('submit-payment', payment.value)
}

onMounted(() => {
    emit('submit-payment', payment.value)
})
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

.radio-group {
    display: flex;
    gap: 16px;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    min-width: auto;
}

.radio-label input {
    accent-color: #FFBC00;
    width: 16px;
    height: 16px;
}

span {
    font-size: 0.9rem;
    color: #545045;
}
</style>