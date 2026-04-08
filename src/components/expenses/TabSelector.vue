<template>
    <!-- 수입, 지출, 이체 탭 -->
    <div class="wrapper">
        <label>분류</label>
        <button
        v-for="tab in tabs"
        :key="tab"
        @click="selected = tab"
        :style="selected === tab ? 'background-color: #FCF2D0' : ''"
        >
        {{ tab }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref('지출');
const tabs = ['수입','지출','이체']
</script>

<style scoped>
.wrapper {
    border: 1px solid black;
    width: 100%; 
    max-width: 400px;
}
</style>