<template>
    <div class="wrapper">
        <label>메모</label>
        <textarea v-model="memo" @input="handleInput" placeholder="자세한 내용은 여기에 쓰세요."></textarea>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const memo = ref('');
const emit = defineEmits(['submit-memo']);

const handleInput = () => {
    emit('submit-memo', memo.value)
}
</script>

<style scoped>
.wrapper {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 16px;
}

label {
    font-size: 0.9rem;
    color: #545045;
    min-width: 40px;
    padding-top: 8px;
}

textarea {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #EBEBEB;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #545045;
    outline: none;
    resize: none;
    height: 100px;
}

textarea:focus {
    border-color: #FFBC00;
}
</style>