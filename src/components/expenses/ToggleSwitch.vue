<template>
    <div class="wrapper">
        <label>고정 지출 등록</label>
        <label class="toggle">
            <input type="checkbox" v-model="isFixed" @change="handleChange">
            <span class="slider"></span>
        </label>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isFixed = ref(false);
const emit = defineEmits(['submit-isFixed']);

const handleChange = () => {
    emit('submit-isFixed', isFixed.value)
}
</script>

<style scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 16px;
    gap: 12px;
}

label {
    font-size: 0.9rem;
    color: #545045;
}

.toggle {
    position: relative;
    width: 50px;
    height: 26px;
    min-width: auto;
}

.toggle input {
    display: none;
}

.slider {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    border-radius: 26px;
    cursor: pointer;
    transition: 0.3s;
    /* 부드럽게 움직이는 애니메이션 */
}

/* ::before 는 CSS 가상 요소, 요소 앞에 가상 요소 생성 */
.slider::before {
    content: '';   /* 빈 요소 생성 */
    position: absolute;
    width: 20px;
    height: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
    /* 부드럽게 움직이는 애니메이션 */
}

.toggle input:checked + .slider {
    background-color: #FFBC00;
}

/* + : 인접 형제 선택자 */
.toggle input:checked + .slider::before {
    transform: translateX(24px);
    /* 체크 됐을 때 동그라미 오른쪽으로 이동 */
}
</style>