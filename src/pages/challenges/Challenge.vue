<template>
  <DefaultLayout>
    <AppHeader title="챌린지 HOME" />
    <div class="challenge-container">
      <header>
        <MonthPicker v-model="dateFilter" />
      </header>
      <main class="card-list">
        <router-link
          v-for="item in challenges"
          :key="item.id"
          :to="{ name: 'challenges/info', params: { id: item.id } }"
          class="card-link"
        >
          <ChallengeCard :challenge="item" />
        </router-link>
      </main>
    </div>
    <AppFooter />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import ChallengeCard from '@/components/challenges/ChallengeCard.vue';
import MonthPicker from '@/components/commons/MonthPicker.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const now = new Date();

const dateFilter = ref({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
});
const challenges = ref([
  { id: 1, challengeName: '목표 1', current: 27, total: 50 },
  { id: 2, challengeName: '목표 2', current: 60, total: 50 },
]);
</script>

<style>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
