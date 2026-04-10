<template>
  <DefaultLayout>
    <AppHeader title="챌린지 HOME" />

    <div class="challenge-container">
      <header class="challenge-header">
        <MonthPicker v-model="dateFilter" />
        <AppButton text="추가" type="single" @click="handleAdd" />
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
import { getUserInfo } from '@/util/authUtil.js';

const userInfo = getUserInfo();
const now = new Date();
const dateFilter = ref({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
});

const router = useRouter();
const challenges = ref([]);

const getChallenges = async () => {
  // if (!userInfo.authenticated) {
  //   alert('로그인 필요');
  //   router.push({ name: 'users/login' });
  //   return;
  // }
  console.log(
    `${dateFilter.value.year}년 ${dateFilter.value.month}월 데이터 및 지출 내역 합산 요청`,
  );

  try {
    const challengeRes = await axios.get('/api/challenges', {
      params: userInfo?.id ? { userId: userInfo.id } : {},
    });

    const expensesRes = await axios.get('/api/expenses', {
      params: userInfo?.id ? { userId: userInfo.id } : {},
    });

    const myChallenges = challengeRes.data;
    const myExpenses = expensesRes.data;

    const updatedChallenges = myChallenges.map((challenge) => {
      const formattedMonth = String(challenge.month).padStart(2, '0');
      const targetYearMonth = `${challenge.year}-${formattedMonth}`;

      const calculatedAmount = myExpenses.reduce((totalSum, expense) => {
        if (!expense.type || !expense.tag) return totalSum;

        const isSameMonth = expense.date.startsWith(targetYearMonth);
        const isSameType = expense.type.typetitle === challenge.type;
        const isSameTag = expense.tag.tagtitle === challenge.tag;

        if (isSameMonth && isSameType && isSameTag) {
          return totalSum + expense.amount;
        }
        return totalSum;
      }, 0);

      return {
        ...challenge,
        currentAmount: calculatedAmount,
      };
    });

    challenges.value = updatedChallenges;
  } catch (error) {
    console.error('챌린지 데이터 및 지출 합산 실패', error);
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

<style scoped>
/* 1. 어항(전체 화면) 크기 고정하기 */
.challenge-container {
  max-width: 400px;
  margin: 0 auto;

  /* 화면 전체 높이에서 상단바/하단바 높이만 딱 뺍니다 */
  height: calc(100vh - 140px);

  display: flex;
  flex-direction: column;

  /* 💡 겉 상자에 있던 padding을 과감히 지워버립니다! (잘림의 원인) */
}

/* 2. 헤더 (달력과 추가 버튼) 양옆 대칭 정렬 */
.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 지워버린 여백 대신, 헤더 자체에만 양옆 여백을 줍니다 */
  padding: 20px 20px 10px 20px;
  flex-shrink: 0;
}

/* 3. 스크롤되는 유리관 (그림자가 잘리던 곳) */
.card-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;

  /* 💡 핵심 수정: 첫 번째 숫자(위쪽 여백)를 15px에서 30px로 확 늘렸습니다! */
  /* 그림자(25px)가 잘리지 않게 충분한 공간을 주고, 달력과의 간격도 벌려줍니다. */
  padding: 30px 25px 40px 25px;
}

/* (선택사항) 스크롤바가 화면을 지저분하게 가리지 않도록 숨겨줍니다 */
.card-list::-webkit-scrollbar {
  display: none;
}

/* 4. 카드(액자) 디자인 및 그림자 진하게 */
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;

  /* 💡 배경색, padding, box-shadow를 모두 지워서 충돌을 없앱니다! */

  transition: transform 0.15s ease;
}

/* 터치 효과는 겉 포장지에 그대로 남겨둡니다 */
.card-link:active {
  transform: scale(0.98);
}
</style>
