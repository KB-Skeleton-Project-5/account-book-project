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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter();
const userInfo = getUserInfo();

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
  if (modalOptions.value.mode === 'login') {
    router.push({ name: 'users/login' });
  }
};

const handleRight = () => {
  isModalOpen.value = false;
  if (modalOptions.value.mode === 'login') {
    router.push({ name: 'users/login' });
  } else if (modalOptions.value.mode === 'duplicate') {
    executeSave();
  }
};

const handleSave = async () => {
  if (!userInfo || !userInfo.authenticated) {
    openModal('login', '알림', '로그인이 필요한 서비스입니다.');
    return;
  }

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
        c.tag === challengeData.value.tag,
    );

    if (isDuplicateTag) {
      const tagLabel = getTagTitle(challengeData.value.tag);
      const confirmMsg = `이번 달에 이미 '${tagLabel}' 카테고리의 챌린지가 존재합니다.\n그래도 추가하시겠습니까?`;
      openModal(
        'duplicate',
        '중복 확인',
        confirmMsg,
        '추가하기',
        '#ffcc00',
        '#333',
        '취소',
      );
      return;
    }

    await executeSave();
  } catch (error) {
    openModal('alert', '오류', '등록 과정 중 에러가 발생했습니다.');
  }
};

const executeSave = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  try {
    const [expensesRes, allChallengesRes] = await Promise.all([
      axios.get('/api/expenses', { params: { user_id: userInfo.id } }),
      axios.get('/api/challenges'),
    ]);

    const myExpenses = expensesRes.data;
    const totalDbChallenges = allChallengesRes.data;

    let nextId = '1';
    if (totalDbChallenges.length > 0) {
      const maxId = Math.max(
        ...totalDbChallenges.map((c) => Number(c.id) || 0),
      );
      nextId = String(maxId + 1);
    }

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

    const newChallenge = {
      id: nextId,
      title: challengeData.value.title,
      tag: challengeData.value.tag,
      targetAmount: challengeData.value.targetAmount * 10000,
      type: challengeData.value.type,
      currentAmount: calculatedAmount,
      year: currentYear,
      month: currentMonth,
      user_id: userInfo.id,
      memo: memoText.value,
    };

    await axios.post('/api/challenges', newChallenge);
    router.push({ name: 'challenges' });
  } catch (error) {
    openModal('alert', '오류', '등록에 실패했습니다.');
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
