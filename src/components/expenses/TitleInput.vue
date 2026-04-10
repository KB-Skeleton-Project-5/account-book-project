<template>
    <!-- 제목(내역) 입력 UI 영역 -->
    <div class="wrapper">
        <label>제목</label>
        <input 
        type="text" 
        v-model="title" 
        @input="handleInput"
        :readonly="props.readonly">
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    value : [ String ],
    readonly : Boolean,
});

watch(() => props.value, (val) => {
    if(val) title.value = val;
}, { immediate : true });

const title = ref('')
const emit = defineEmits(['submit-title']);

const handleInput = () => {
    emit('submit-title',title.value)
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