<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="챌린지 ADD" :back="true" backTo="challenges" />
    </template>

    <div class="add-container">
      <div class="challenge-add-card">
        <ChallengeSetup v-model="challengeData" />

        <p class="section-title">메모</p>
        <MemoWrite v-model="memoText" />

        <footer class="add-action-buttons">
          <AppButton type="history" text="취소" @click="handleCancel" />
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
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import axios from 'axios';
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

const handleCancel = () => {
  console.log('취소 버튼 클릭됨');
  router.push({ name: 'challenges' });
};

const handleSave = async () => {
  console.log('저장 버튼 클릭됨');

  // if (!userInfo || !userInfo.authenticated) {
  //   alert('로그인이 필요한 서비스입니다.');
  //   router.push({ name: 'users/login' });
  //   return;
  // }

  if (!challengeData.value.title || challengeData.value.title.trim() === '') {
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
  console.log('제목/목표 금액 검사 완료');

  const now = new Date();

  try {
    const expensesRes = await axios.get('/api/expenses', {
      params: userInfo?.id ? { userId: userInfo.id } : {},
    });
    const myExpenses = expensesRes.data;
    const targetYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    console.log('API로 가져온 전체 지출 내역:', myExpenses);

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

      if (isSameMonth && isSameType && isSameTag) {
        return totalSum + Number(expense.amount);
      }
      return totalSum;
    }, 0);

    const newChallenge = {
      title: challengeData.value.title,
      tag: challengeData.value.tag,
      targetAmount: challengeData.value.targetAmount * 10000,
      type: challengeData.value.type,
      currentAmount: calculatedAmount,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      userId: userInfo.id,
      memo: memoText.value,
    };

    await axios.post('/api/challenges', newChallenge);

    console.log('새 챌린지 등록 완료');
    router.push({ name: 'challenges' });
  } catch (error) {
    console.error('등록 실패 에러', error);
    alert('등록 실패');
  }
};
</script>

<style scoped>
.add-container {
  padding: 20px 0;
}

/* 🎨 카드 디자인: 너비를 줄여서 더 콤팩트하게 변경 */
.challenge-add-card {
  width: calc(100% - 64px); /* 좌우 여백 확대 (기존 -40px) */
  max-width: 400px; /* 최대 너비 축소 (기존 450px) */
  background-color: #ffffff;
  border-radius: 20px;
  padding: 32px;
  margin: 0 auto;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

/* 💡 행간 축소: 요소 사이의 간격을 좁힘 */
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 20px; /* 위쪽 간격 축소 (기존 32px) */
  margin-bottom: 10px; /* 아래쪽 간격 축소 (기존 12px) */
  letter-spacing: -0.02em;
}

/* 💡 버튼 그룹 간격 축소 */
.add-action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 28px; /* 버튼과의 간격 축소 (기존 40px) */
}
</style>
