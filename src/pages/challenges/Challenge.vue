<template>
  <DefaultLayout>
    <AppHeader title="챌린지 HOME" />
    <AppButton text="추가" type="single" @click="handleAdd" />
    <div class="challenge-container">
      <header>
        <MonthPicker v-model="dateFilter" />
      </header>
      <main class="card-list">
        <router-link
          v-for="item in filteredChallenges"
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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeCard from '@/components/challenges/ChallengeCard.vue';
import MonthPicker from '@/components/commons/MonthPicker.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppButton from '@/components/commons/AppButton.vue';
import axios from 'axios';

const now = new Date();
const dateFilter = ref({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
});

const router = useRouter();

const challenges = ref([]);

const getChallenges = async () => {
  console.log(
    `${dateFilter.value.year}년 ${dateFilter.value.month}월 데이터 요청`,
  );

  try {
    const response = await axios.get('/api/challengesdb');
    challenges.value = response.data;
  } catch (error) {
    console.error('에러 발생 2', error);
  }
};

const filteredChallenges = computed(() => {
  return challenges.value.filter((item) => {
    return (
      item.year === dateFilter.value.year &&
      item.month === dateFilter.value.month
    );
  });
});

onMounted(() => {
  getChallenges();
});

const handleAdd = () => {
  console.log('추가 버튼 클릭됨');
  router.push({ name: 'challenges/add' });
};
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
