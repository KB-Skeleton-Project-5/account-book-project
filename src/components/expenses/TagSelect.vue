<template>
    <div class="wrapper">
        <label>태그</label>
        <div class="tag-group">
            <button
            v-for="tag in tags"
            :key="tag"
            @click="handleSelect(tag)"
            :class="{ active : selected === tag }"
            class="tag-btn"
            >
            {{ tag }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const selected = ref('식비');
const tags = ['식비', '교통비', '쇼핑', '기타', '+'];
const emit = defineEmits(['submit-tag']);

const handleSelect = (tag) => {
    selected.value = tag
    emit('submit-tag', tag)
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
}
.tag-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}
.tag-btn {
    padding: 6px 16px;
    border: 1px solid #EBEBEB;
    border-radius: 20px;
    background-color: #ffffff;
    color: #9e9e9e;
    font-size: 0.85rem;
    cursor: pointer;
}
.tag-btn.active {
    background-color: #FCF2D0;
    color: #545045;
    border-color: #FFBC00;
}
</style>