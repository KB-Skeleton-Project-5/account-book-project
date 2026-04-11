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
        <p>챌린지 정보 불러오는 중</p>
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>

  <DeleteConfirm
    v-if="isModalOpen"
    :title="modalOptions.title"
    :message="modalOptions.message"
    :leftText="modalOptions.leftText"
    :rightText="modalOptions.rightText"
    :rightColor="modalOptions.rightColor"
    :rightTextColor="modalOptions.rightTextColor"
    @left="handleLeft"
    @right="handleRight"
  />
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
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';
import { getUserInfo } from '@/util/authUtil.js';
import { getTagTitle } from '@/util/tagUtil.js';

const route = useRoute();
const router = useRouter();
const userInfo = getUserInfo();
const isDataLoaded = ref(false);
const challengeId = route.params.id;

const challengeData = ref({
  title: '',
  tag: 'all',
  targetAmount: 1,
  type: '지출',
});

const memoText = ref('');

const isModalOpen = ref(false);
const modalOptions = ref({
  mode: '',
  title: '',
  message: '',
  leftText: '닫기',
  rightText: '확인',
  rightColor: '#ffcc00',
  rightTextColor: '#333',
});

const openModal = (
  mode,
  title,
  message,
  rightText = '확인',
  rightColor = '#ffcc00',
  rightTextColor = '#333',
  leftText = '닫기',
) => {
  modalOptions.value = {
    mode,
    title,
    message,
    rightText,
    rightColor,
    rightTextColor,
    leftText,
  };
  isModalOpen.value = true;
};

const handleLeft = () => {
  isModalOpen.value = false;
  if (
    modalOptions.value.mode === 'login' ||
    modalOptions.value.mode === 'auth_error'
  ) {
    router.push({ name: 'users/login' });
  } else if (modalOptions.value.mode === 'invalid_access') {
    router.push({ name: 'challenges' });
  }
};

const handleRight = () => {
  isModalOpen.value = false;
  if (
    modalOptions.value.mode === 'login' ||
    modalOptions.value.mode === 'auth_error'
  ) {
    router.push({ name: 'users/login' });
  } else if (modalOptions.value.mode === 'invalid_access') {
    router.push({ name: 'challenges' });
  } else if (modalOptions.value.mode === 'duplicate') {
    executeUpdate();
  }
};

const getOldData = async () => {
  if (!userInfo || !userInfo.authenticated) {
    openModal('login', '알림', '로그인이 필요한 서비스입니다.');
    return;
  }

  try {
    const response = await axios.get(`/api/challenges/${challengeId}`);
    const oldData = response.data;

    if (!oldData || String(oldData.user_id) !== String(userInfo.id)) {
      openModal('invalid_access', '알림', '권한이 없거나 잘못된 접근입니다.');
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
    openModal('invalid_access', '오류', '정보를 불러오는데 실패했습니다.');
  }
};

const handleUpdate = async () => {
  if (!challengeData.value.title?.trim()) {
    openModal('alert', '알림', '챌린지 제목을 입력해주세요.');
    return;
  }
  if (
    !challengeData.value.targetAmount ||
    challengeData.value.targetAmount <= 0
  ) {
    openModal('alert', '알림', '목표 금액을 설정해주세요.');
    return;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  try {
    const challengeRes = await axios.get('/api/challenges', {
      params: { user_id: userInfo.id },
    });
    const allChallenges = challengeRes.data;

    const isDuplicateTag = allChallenges.some(
      (c) =>
        Number(c.year) === currentYear &&
        Number(c.month) === currentMonth &&
        c.tag === challengeData.value.tag &&
        String(c.id) !== String(challengeId),
    );

    if (isDuplicateTag) {
      const tagLabel = getTagTitle(challengeData.value.tag);
      const confirmMsg = `이번 달에 이미 '${tagLabel}' 카테고리의 챌린지가 존재합니다.\n이대로 수정하시겠습니까?`;
      openModal(
        'duplicate',
        '중복 확인',
        confirmMsg,
        '수정하기',
        '#ffcc00',
        '#333',
        '취소',
      );
      return;
    }

    await executeUpdate();
  } catch (error) {
    openModal('alert', '오류', '수정 과정 중 에러가 발생했습니다.');
  }
};

const executeUpdate = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  try {
    const expensesRes = await axios.get('/api/expenses', {
      params: { user_id: userInfo.id },
    });
    const myExpenses = expensesRes.data;
    const targetYearMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    const calculatedAmount = myExpenses.reduce((totalSum, expense) => {
      if (!expense.type || !expense.tag) return totalSum;

      const expTypeTitle = expense.type.typetitle || expense.type;
      const expTagId = expense.tag.tagid || expense.tag;

      const isSameMonth =
        expense.date && expense.date.includes(targetYearMonth);
      const isSameType = expTypeTitle === challengeData.value.type;
      const isSameTag =
        challengeData.value.tag === 'all' ||
        expTagId === challengeData.value.tag;

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
      year: currentYear,
      month: currentMonth,
      user_id: userInfo.id,
    };

    await axios.put(`/api/challenges/${challengeId}`, updatedChallenge);
    router.push({ name: 'challenges/info', params: { id: challengeId } });
  } catch (error) {
    openModal('alert', '오류', '수정에 실패했습니다.');
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
