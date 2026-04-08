<template>
  <div class="challenge-container">
    <header>
      <MonthPicker />
    </header>
    <main class="card-list">
      <ChallengeCard
        v-for="item in challenges"
        :key="item.id"
        :challenge="item"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChallengeCard from '@/components/challenges/ChallengeCard.vue';
import MonthPicker from '@/components/commons/MonthPicker.vue';

const challenges = ref([
  {
    id: 1,
    challengeName: '목표 1',
  },
  {
    id: 2,
    challengeName: '목표 2',
  },
]);
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #fde8a2;
  height: 100%;
}
</style>
