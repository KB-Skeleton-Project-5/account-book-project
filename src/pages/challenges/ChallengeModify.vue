<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="챌린지 수정" :back="true" backTo="challenges" />
    </template>

    <div class="modify-container">
      <div v-if="isDataLoaded" class="challenge-modify-card">
        <ChallengeSetup v-model="challengeData" />

        <p class="section-title">메모</p>
        <MemoWrite v-model="memoText" />

        <footer class="modify-action-buttons">
          <AppButton type="single" text="저장" @click="handleUpdate" />
        </footer>
      </div>

      <div v-else class="loading-state">
        <p>챌린지 정보 불러오는 중...</p>
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { getUserInfo } from '@/util/authUtil.js';

const route = useRoute();
const router = useRouter();
const userInfo = getUserInfo();
const isDataLoaded = ref(false);
const challengeId = route.params.id;

const challengeData = ref({
  title: '',
  tag: '전체',
  targetAmount: 1,
  type: '지출',
});

const memoText = ref('');

const getOldData = async () => {
  if (!userInfo || !userInfo.authenticated) {
    alert('로그인이 필요한 서비스입니다.');
    router.push({ name: 'users/login' });
    return;
  }

  try {
    const response = await axios.get(`/api/challenges/${challengeId}`);
    const oldData = response.data;

    if (!oldData || String(oldData.userId) !== String(userInfo.id)) {
      alert('권한이 없거나 잘못된 접근입니다.');
      router.push({ name: 'challenges' });
      return;
    }

    challengeData.value = {
      title: oldData.title,
      tag: oldData.tag,
      targetAmount: oldData.targetAmount / 10000,
      type: oldData.type,
    };
    memoText.value = oldData.memo || '';
    isDataLoaded.value = true;
  } catch (error) {
    console.error(error);
    router.push({ name: 'challenges' });
  }
};

const handleUpdate = async () => {
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

  try {
    const expensesRes = await axios.get('/api/expenses', {
      params: { userId: userInfo.id },
    });
    const myExpenses = expensesRes.data;
    const targetYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

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

    const updatedChallenge = {
      title: challengeData.value.title,
      tag: challengeData.value.tag,
      targetAmount: challengeData.value.targetAmount * 10000,
      type: challengeData.value.type,
      memo: memoText.value,
      currentAmount: calculatedAmount,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      userId: userInfo.id,
    };

    await axios.put(`/api/challenges/${challengeId}`, updatedChallenge);
    router.push({ name: 'challenges/info', params: { id: challengeId } });
  } catch (error) {
    console.error(error);
    alert('수정에 실패했습니다.');
  }
};

onMounted(getOldData);
</script>

<style scoped>
.modify-container {
  padding: 20px 0;
}

.challenge-modify-card {
  width: calc(100% - 64px);
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 32px;
  margin: 0 auto;
  box-sizing: border-box;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 20px;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.modify-action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}

.loading-state {
  text-align: center;
  padding: 50px;
  color: #64748b;
  font-weight: 500;
}
</style>
