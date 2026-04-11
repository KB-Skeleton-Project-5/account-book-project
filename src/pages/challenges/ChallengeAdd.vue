<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="챌린지 추가" :back="true" backTo="challenges" />
    </template>

    <div class="add-container">
      <div class="challenge-add-card">
        <ChallengeSetup v-model="challengeData" />

        <p class="section-title">메모</p>
        <MemoWrite v-model="memoText" />

        <footer class="add-action-buttons">
          <AppButton type="single" text="저장" @click="handleSave" />
        </footer>
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { getUserInfo } from '@/util/authUtil.js';

const router = useRouter();
const userInfo = getUserInfo();

const challengeData = ref({
  title: '',
  tag: '전체',
  targetAmount: 1,
  type: '지출',
});

const memoText = ref('');

const handleSave = async () => {
  if (!userInfo || !userInfo.authenticated) {
    alert('로그인이 필요한 서비스입니다.');
    router.push({ name: 'users/login' });
    return;
  }

  if (!challengeData.value.title?.trim()) {
    alert('챌린지 제목 입력 필요');
    return;
  }

  if (
    !challengeData.value.targetAmount ||
    challengeData.value.targetAmount <= 0
  ) {
    alert('목표 금액 설정 필요');
    return;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  try {
    const expensesRes = await axios.get('/api/expenses', {
      params: { userId: userInfo.id },
    });
    const myExpenses = expensesRes.data;
    const targetYearMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    const calculatedAmount = myExpenses.reduce((totalSum, expense) => {
      if (!expense.type || !expense.tag) return totalSum;

      const expTypeTitle = expense.type.typetitle || expense.type;
      const expTagTitle = expense.tag.tagtitle || expense.tag;

      const isSameMonth =
        expense.date && expense.date.includes(targetYearMonth);
      const isSameType = expTypeTitle === challengeData.value.type;
      const isSameTag =
        challengeData.value.tag === '전체' ||
        expTagTitle === challengeData.value.tag;

      return isSameMonth && isSameType && isSameTag
        ? totalSum + Number(expense.amount)
        : totalSum;
    }, 0);

    const newChallenge = {
      title: challengeData.value.title,
      tag: challengeData.value.tag,
      targetAmount: challengeData.value.targetAmount * 10000,
      type: challengeData.value.type,
      currentAmount: calculatedAmount,
      year: currentYear,
      month: currentMonth,
      userId: userInfo.id,
      memo: memoText.value,
    };

    await axios.post('/api/challenges', newChallenge);
    router.push({ name: 'challenges' });
  } catch (error) {
    console.error(error);
    alert('등록 실패');
  }
};
</script>

<style scoped>
.add-container {
  padding: 20px 0;
}

.challenge-add-card {
  width: calc(100% - 64px);
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 32px;
  margin: 0 auto;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 20px;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.add-action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}
</style>
