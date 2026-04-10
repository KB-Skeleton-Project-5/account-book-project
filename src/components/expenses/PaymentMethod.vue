<template>
    <div class="wrapper">
        <label>결제수단</label>
        <div class="radio-group">
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
                <span>현금</span>
            </label>
        </div>
    </div>
</template>

<script setup>
import { readonly, ref, watch } from 'vue';

const props = defineProps({
    value : [ String ],
    readonly: Boolean,
});

watch(() => props.value, (val) => {
    if(val) payment.value = val;
}, { immediate : true });

const payment = ref('card');
const emit = defineEmits(['submit-payment']);

const handleChange = () => {
    emit('submit-payment', payment.value)
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