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
/* 1. 어항(전체 화면) 크기 고정 및 반응형 처리 */
.challenge-container {
  width: 100%; /* 💡 추가: 모바일에서는 화면을 100% 꽉 채웁니다 */
  max-width: 450px; /* PC에서는 너무 넓어지지 않게 450px로 고정 */
  margin: 0 auto;
  box-sizing: border-box; /* 💡 추가: 패딩을 너비에 포함시켜 삐져나가지 않게 함 */

  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

/* 2. 헤더 (달력과 추가 버튼) */
.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px 10px 25px; /* 양옆 여백을 25px로 통일 */
  flex-shrink: 0;
  box-sizing: border-box;
}

/* 3. 스크롤되는 유리관 */
.card-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 30px 25px 40px 25px;
  box-sizing: border-box; /* 💡 추가: 스크롤바 영역이 화면 밖으로 밀려나지 않도록 보호 */
}

.card-list::-webkit-scrollbar {
  display: none;
}

/* 4. 카드 링크 껍데기 */
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;

  /* 💡 [수정] 애니메이션을 더 부드럽고 고급스럽게 (0.3초 + ease-out) */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform; /* 브라우저에게 애니메이션 예고 (성능 최적화) */
}

/* 💡 [핵심 추가] 마우스를 올렸을 때 (Hover) */
.card-link:hover {
  /* 1. 위로 8px 이동하면서 1.02배 커짐 */
  transform: translateY(-8px) scale(1.02);
}

/* 💡 [핵심 추가] 마우스를 올렸을 때 자식 컴포넌트인 카드의 그림자를 더 진하게 */
.card-link:hover :deep(.challenge-card) {
  /* 기존 그림자보다 더 멀리 퍼지고 진하게 하여 '공중에 떴다'는 느낌을 줍니다 */
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12);
}

/* 터치 효과 (모바일/클릭 시) */
.card-link:active {
  transform: scale(0.98);
}
</style>
