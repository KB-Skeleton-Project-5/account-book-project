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
import { onMounted, ref, watch } from 'vue';
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

const challenges = ref([]);

const fetchChallenges = async () => {
  console.log(
    `${dateFilter.value.year}년 ${dateFilter.value.month}월 데이터 요청`,
  );
  setTimeout(() => {
    challenges.value = [
      { id: 1, challengeName: '목표 1', current: 27, total: 50, tag: '식비' },

      { id: 2, challengeName: '목표 2', current: 60, total: 50, tag: '교통비' },
    ];
  }, 500);

  // try {
  //   const response = await fetch('http://localhost:3000/challenges');
  //   if (!response.ok) throw new Error('에러 발생 1');

  //   const data = await response.json();

  //   challenges.value = data;
  // } catch (error) {
  //   console.error('에러 발생 2', error);
  // }
};

onMounted(() => {
  fetchChallenges();
});

watch(
  dateFilter,
  () => {
    challenges.value = [];
    fetchChallenges();
  },
  { deep: true },
);
</script>

<style>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.card-link:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}
</style>
