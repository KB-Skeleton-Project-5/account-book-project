<template>
  <div>챌린지 메인</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'

const challenges = ref([]);
const currentYear = ref(2026);
const currentMonth = ref(4);

</script>