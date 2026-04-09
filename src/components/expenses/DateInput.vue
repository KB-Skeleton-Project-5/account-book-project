<template>
    <!-- 날짜 Input 태그 -->
    <div class="wrapper">
        <label>날짜</label>
        <input type="date" v-model="date" @input="handleInput">
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const date = ref(new Date().toISOString().split('T')[0]);
/// new Date().toISOString().split('T')[0]는 JS에서 현재 날짜를 YYYY-MM-DD 형식

const props = defineProps({
    value : [ String ]
});

watch(() => props.value, (val) => {
    if(val !== undefined) date.value = val;
}, { imediate : true });

const emit = defineEmits(['submit-date']);

const handleInput = () => {
    emit('submit-date',date.value)
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