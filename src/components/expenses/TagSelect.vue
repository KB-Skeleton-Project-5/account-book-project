<template>
    <div class="wrapper">
        <label>태그</label>
        <button
        v-for="tag in tags"
        :key="tag"
        @click="selected = tag"
        :style="selected === tag ? 'background-color: #FCF2D0;' : ''"
        >
        {{ tag }}</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const selected = ref('식비');
const tags = ['식비', '교통비', '쇼핑', '기타' , '+'];
</script>


<!-- 
:class="{ active: selected === tag }"

<style>
.active {
  background-color: #FCF2D0;
}
</style>

-->

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>