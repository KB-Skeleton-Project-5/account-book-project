<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="내 챌린지" />
    </template>

    <div class="challenge-container">
      <header class="challenge-header">
        <MonthPicker v-model="dateFilter" />
        <AppButton text="추가" type="single" @click="handleAdd" />
      </header>

      <div v-if="filteredChallenges.length > 0" class="card-list">
        <router-link
          v-for="item in filteredChallenges"
          :key="item.id"
          :to="{ name: 'challenges/info', params: { id: item.id } }"
          class="card-link"
        >
          <ChallengeCard :challenge="item" />
        </router-link>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">!</div>
        <p class="empty-text">이번 달 등록된 챌린지가 없습니다.</p>
        <button class="empty-btn" @click="handleAdd">
          새로운 챌린지 도전하기
        </button>
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ChallengeCard from '@/components/challenges/ChallengeCard.vue';
import MonthPicker from '@/components/commons/MonthPicker.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppButton from '@/components/commons/AppButton.vue';
import { getUserInfo } from '@/util/authUtil.js';

const userInfo = getUserInfo();
const router = useRouter();
const challenges = ref([]);
const now = new Date();

const dateFilter = ref({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
});

const getChallenges = async () => {
  if (!userInfo || !userInfo.authenticated) {
    alert('로그인이 필요한 서비스입니다.');
    router.push({ name: 'users/login' });
    return;
  }

  try {
    const [challengeRes, expensesRes] = await Promise.all([
      axios.get('/api/challenges', { params: { user_id: userInfo.id } }),
      axios.get('/api/expenses', { params: { user_id: userInfo.id } }),
    ]);

    const challengeList = challengeRes.data;
    const myExpenses = expensesRes.data;

    challenges.value = await Promise.all(
      challengeList.map(async (challenge) => {
        const targetYearMonth = `${challenge.year}-${String(challenge.month).padStart(2, '0')}`;

        const calculatedAmount = myExpenses.reduce((totalSum, expense) => {
          if (!expense.type || !expense.tag) return totalSum;

          const expTypeTitle = expense.type.typetitle || expense.type;
          const expTagId = expense.tag.tagid || expense.tag;

          const isSameMonth =
            expense.date && expense.date.includes(targetYearMonth);
          const isSameType = expTypeTitle === challenge.type;
          const isSameTag =
            challenge.tag === 'all' || expTagId === challenge.tag;

          return isSameMonth && isSameType && isSameTag
            ? totalSum + Number(expense.amount)
            : totalSum;
        }, 0);

        if (challenge.currentAmount !== calculatedAmount) {
          await axios.patch(`/api/challenges/${challenge.id}`, {
            currentAmount: calculatedAmount,
          });
        }

        return { ...challenge, currentAmount: calculatedAmount };
      }),
    );
  } catch (error) {
    console.error(error);
  }
};

const filteredChallenges = computed(() => {
  return challenges.value.filter(
    (item) =>
      item.year === dateFilter.value.year &&
      item.month === dateFilter.value.month,
  );
});

const handleAdd = () => {
  router.push({ name: 'challenges/add' });
};

onMounted(getChallenges);
</script>

<style scoped>
:deep(.app-content::-webkit-scrollbar) {
  display: none;
}

:deep(.app-content) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.challenge-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px 10px 25px;
  flex-shrink: 0;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 25px 40px 25px;
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
}

.card-link:hover {
  transform: translateY(-8px) scale(1.02);
}

.card-link:hover :deep(.challenge-card) {
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12);
}

.card-link:active {
  transform: scale(0.98);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 60px;
  height: 60px;
  background-color: #f1f5f9;
  color: #94a3b8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 24px;
}

.empty-btn {
  padding: 12px 24px;
  background-color: #ffcc00;
  color: #1e293b;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(255, 204, 0, 0.2);
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 204, 0, 0.3);
}

.empty-btn:active {
  transform: translateY(0);
}
</style>
