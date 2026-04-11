<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="챌린지 HOME" />
    </template>

    <div class="challenge-container">
      <header class="challenge-header">
        <MonthPicker v-model="dateFilter" />
        <AppButton text="추가" type="single" @click="handleAdd" />
      </header>

      <div class="card-list">
        <router-link
          v-for="item in filteredChallenges"
          :key="item.id"
          :to="{ name: 'challenges/info', params: { id: item.id } }"
          class="card-link"
        >
          <ChallengeCard :challenge="item" />
        </router-link>
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
  // if (!userInfo || !userInfo.authenticated) {
  //   alert('로그인이 필요한 서비스입니다.');
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

    // 💡 여러 개가 담긴 배열이므로 List로 이름을 지어줍니다.
    const challengeList = challengeRes.data;
    const myExpenses = expensesRes.data;

    const updatedChallenges = challengeList.map((challenge) => {
      const formattedMonth = String(challenge.month).padStart(2, '0');
      const targetYearMonth = `${challenge.year}-${formattedMonth}`;

      const calculatedAmount = myExpenses.reduce((totalSum, expense) => {
        if (!expense.type || !expense.tag) return totalSum;

        const expTypeTitle = expense.type.typetitle || expense.type;
        const expTagTitle = expense.tag.tagtitle || expense.tag;

        const isSameMonth =
          expense.date && expense.date.includes(targetYearMonth);

        // 💡 낱개 과일인 challenge.type과 challenge.tag를 비교합니다.
        const isSameType = expTypeTitle === challenge.type;
        const isSameTag =
          challenge.tag === '전체' || expTagTitle === challenge.tag;

        if (isSameMonth && isSameType && isSameTag) {
          return totalSum + Number(expense.amount);
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
  router.push({ name: 'challenges/add' });
};
</script>

<style scoped>
/* 1. 💡 레이아웃: 이제 높이 계산(100vh)이 필요 없습니다! */
.challenge-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 2. 헤더 (달력과 추가 버튼) */
.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px 10px 25px;
  flex-shrink: 0;
}

/* 3. 카드 리스트 영역 */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 25px 40px 25px; /* 하단 여백을 주어 푸터와 겹치지 않게 함 */
}

/* 4. 💖 카드 링크 껍데기 (용진님이 좋아하시는 쫀득한 효과 유지) */
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
</style>
