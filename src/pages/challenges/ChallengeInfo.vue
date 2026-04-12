<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="챌린지 정보" :back="true" backTo="challenges" />
    </template>

    <div class="info-container">
      <div v-if="isDataLoaded" class="challenge-info">
        <header class="info-header">
          <h2>{{ challenge.title }}</h2>
          <div class="percentage-badge" :style="badgeStyle">
            {{ challengeResult }}
          </div>
        </header>

        <ProgressBar
          :current="challenge.currentAmount"
          :total="challenge.targetAmount"
          :type="challenge.type"
        />

        <div class="description-action-wrapper">
          <ChallengeDescription
            :tag="challenge.tag"
            :targetAmount="challenge.targetAmount / 10000"
            :type="challenge.type"
          />
          <AppButton
            type="history"
            text="내역"
            @click="handleHistory"
            class="history-btn-right"
          />
        </div>

        <p class="section-title">메모</p>
        <MemoDisplay :memo="challenge.memo" />

        <footer class="low-button">
          <AppButton
            v-if="!isPastChallenge"
            type="edit-delete"
            @edit="handleEdit"
            @delete="handleDelete"
          />
          <AppButton v-else type="single" text="삭제" @click="handleDelete" />
        </footer>
      </div>

      <div v-else class="loading-state">
        <p>정보 불러오는 중</p>
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>

  <DeleteConfirm
    v-if="isModalOpen"
    @left="cancelDelete"
    @right="confirmDelete"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import AppButton from '@/components/commons/AppButton.vue';
import ProgressBar from '@/components/challenges/ProgressBar.vue';
import ChallengeDescription from '@/components/challenges/ChallengeDescription.vue';
import MemoDisplay from '@/components/challenges/MemoDisplay.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';
import { getUserInfo } from '@/util/authUtil.js';

const route = useRoute();
const router = useRouter();
const userInfo = getUserInfo();
const isDataLoaded = ref(false);
const isModalOpen = ref(false);

const challenge = ref({
  title: '',
  tag: '',
  currentAmount: 0,
  targetAmount: 1,
  type: '지출',
  memo: '',
});

const percentage = computed(() => {
  const target = Number(challenge.value.targetAmount);
  if (target === 0) return 0;
  return (Number(challenge.value.currentAmount) / target) * 100;
});

const isPastChallenge = computed(() => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const challengeYear = Number(challenge.value.year);
  const challengeMonth = Number(challenge.value.month);

  return (
    challengeYear < currentYear ||
    (challengeYear === currentYear && challengeMonth < currentMonth)
  );
});

const challengeResult = computed(() => {
  const rawValue = Math.floor(percentage.value);
  const { type, currentAmount, targetAmount } = challenge.value;
  const current = Number(currentAmount);
  const target = Number(targetAmount);

  if (isPastChallenge.value) {
    if (type === '지출') return current < target ? '목표 달성!' : '목표 실패!';
    return current >= target ? '목표 달성!' : '목표 실패!';
  }

  if (type === '지출') return rawValue >= 100 ? '목표 실패!' : `${rawValue}%`;
  if (type === '수입') return rawValue >= 100 ? '목표 달성!' : `${rawValue}%`;
  return `${rawValue}%`;
});

const badgeStyle = computed(() => {
  const perc = percentage.value;
  const result = challengeResult.value;
  const type = challenge.value.type;

  if (result === '목표 달성!')
    return { backgroundColor: '#64B5F6', color: '#ffffff' };
  if (result === '목표 실패!')
    return { backgroundColor: '#7D1A1A', color: '#ffffff' };

  let backgroundColor = '#f0f0f0';
  if (type === '수입') {
    if (perc < 30) backgroundColor = '#E57373';
    else if (perc < 70) backgroundColor = '#ffcc00';
    else backgroundColor = '#66A882';
  } else {
    if (perc < 30) backgroundColor = '#66A882';
    else if (perc < 70) backgroundColor = '#ffcc00';
    else backgroundColor = '#E57373';
  }
  return {
    backgroundColor,
    color: perc < 70 && perc >= 30 ? '#333333' : '#ffffff',
  };
});

const getChallengeInfo = async () => {
  if (!userInfo || !userInfo.authenticated) {
    alert('로그인이 필요한 서비스입니다.');
    router.push({ name: 'users/login' });
    return;
  }

  const challengeId = route.params.id;

  try {
    const challengeRes = await axios.get(`/api/challenges/${challengeId}`);
    const challengeData = challengeRes.data;

    if (String(challengeData.user_id) !== String(userInfo.id)) {
      alert('접근 권한이 없습니다.');
      router.push({ name: 'challenges' });
      return;
    }

    const formattedMonth = String(challengeData.month).padStart(2, '0');
    const targetYearMonth = `${challengeData.year}-${formattedMonth}`;

    const expensesRes = await axios.get(`/api/expenses`, {
      params: { user_id: userInfo.id },
    });
    const myExpenses = expensesRes.data;

    const calculatedAmount = myExpenses.reduce((totalSum, expense) => {
      if (!expense.type || !expense.tag) return totalSum;

      const expTypeTitle = expense.type.typetitle || expense.type;
      const expTagId = expense.tag.tagid || expense.tag;

      const isSameMonth =
        expense.date && expense.date.includes(targetYearMonth);
      const isSameType = expTypeTitle === challengeData.type;
      const isSameTag =
        challengeData.tag === 'all' || expTagId === challengeData.tag;

      return isSameMonth && isSameType && isSameTag
        ? totalSum + Number(expense.amount)
        : totalSum;
    }, 0);

    if (challengeData.currentAmount !== calculatedAmount) {
      await axios.patch(`/api/challenges/${challengeId}`, {
        currentAmount: calculatedAmount,
      });
      challengeData.currentAmount = calculatedAmount;
    }

    challenge.value = challengeData;
    isDataLoaded.value = true;
  } catch (error) {
    console.error(error);
    router.push({ name: 'challenges' });
  }
};

const handleHistory = () => {
  const { year, month, type, tag } = challenge.value;
  const lastDay = new Date(year, month, 0).getDate();
  const formattedMonth = String(month).padStart(2, '0');

  const queryParams = {
    startDate: `${year}-${formattedMonth}-01`,
    endDate: `${year}-${formattedMonth}-${String(lastDay).padStart(2, '0')}`,
    type: type,
  };

  if (tag && tag !== 'all') {
    queryParams.tags = tag;
  }

  router.push({ name: 'expenses', query: queryParams });
};

const handleEdit = () => {
  router.push({ name: 'challenges/modify', params: { id: route.params.id } });
};

const handleDelete = () => {
  isModalOpen.value = true;
};
const cancelDelete = () => {
  isModalOpen.value = false;
};
const confirmDelete = async () => {
  try {
    await axios.delete(`/api/challenges/${route.params.id}`);
    isModalOpen.value = false;
    router.push({ name: 'challenges' });
  } catch (error) {
    console.error(error);
    alert('삭제 실패');
  }
};

onMounted(getChallengeInfo);
</script>

<style scoped>
.info-container {
  padding: 20px 0;
}

.challenge-info {
  width: calc(100% - 40px);
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 24px;
  margin: 0 auto;
  box-sizing: border-box;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.info-header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.03em;
  flex: 1;
  padding-right: 10px;
}

.percentage-badge {
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.description-action-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 32px;
}

:deep(.description-container) {
  margin-top: 0 !important;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 32px;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.low-button {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.memo-display-container) {
  border-radius: 12px;
  background-color: #f8fafc;
}

.loading-state {
  text-align: center;
  padding: 50px;
  color: #64748b;
}
</style>
