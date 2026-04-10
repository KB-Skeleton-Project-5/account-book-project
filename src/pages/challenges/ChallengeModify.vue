<template>
  <DefaultLayout>
    <AppHeader title="챌린지 MODIFY" :back="true" backTo="challenges" />
    <div v-if="isDataLoaded" class="challenge-modify-container">
      <ChallengeSetup v-model="challengeData" />
      <p>메모</p>
      <MemoWrite v-model="memoText" />
      <footer class="modify-action-buttons">
        <AppButton
          type="history"
          text="취소"
          @click="router.push({ name: 'challenges' })"
        />
        <AppButton type="single" text="수정" @click="handleUpdate" />
      </footer>
    </div>
    <div v-else style="text-align: center; padding: 50px; color: #666">
      <p>챌린지 정보 불러오는 중</p>
    </div>
    <AppFooter />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil.js';

const route = useRoute();
const router = useRouter();
const userInfo = getUserInfo();

const challengeData = ref({
  title: '',
  tag: '식비',
  targetAmount: 0,
  type: '지출',
});

const memoText = ref('');
const isDataLoaded = ref(false);
const challengeId = route.params.id;

const getOldData = async () => {
  try {
    const response = await axios.get(`/api/challenges/${challengeId}`);
    const oldData = response.data;

    if (!oldData) {
      alert('챌린지 불러오기 오류');
      router.push({ name: 'challenges' });
      return;
    }

    // if (String(oldData.userId) !== String(userInfo.id)) {
    //   alert('다른 사용자의 챌린지는 수정할 수 없습니다.');
    //   router.push({ name: 'challenges' });
    //   return;
    // }

    challengeData.value = {
      title: oldData.title,
      tag: oldData.tag,
      targetAmount: oldData.targetAmount / 10000,
      currentAmount: oldData.currentAmount / 10000,
      type: oldData.type,
    };
    memoText.value = oldData.memo || '';

    isDataLoaded.value = true;
  } catch (error) {
    console.error('데이터 불러오기 오류:', error);
    alert('데이터 불러오기 오류');
    router.push({ name: 'challenges' });
  }
};

onMounted(() => {
  getOldData();
});

const handleUpdate = async () => {
  const now = new Date();

  try {
    const expensesRes = await axios.get('/api/expenses', {
      params: userInfo?.id ? { userId: userInfo.id } : {},
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

      if (isSameMonth && isSameType && isSameTag) {
        return totalSum + Number(expense.amount);
      }
      return totalSum;
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

    console.log('챌린지 수정 완료!');
    router.push({ name: 'challenges/info', params: { id: challengeId } });
  } catch (error) {
    console.error('수정 실패:', error);
    alert('수정에 실패했습니다.');
  }
};
</script>

<style scoped>
/* 1. 하얀색 메인 카드 (Add/Modify 공통) */
.challenge-modify-container {
  width: calc(100% - 40px);
  max-width: 450px; /* 메인 카드 폭과 맞춤 */
  background-color: #ffffff;
  border-radius: 20px; /* 메인 카드와 동일하게 20px */
  padding: 32px; /* 여백을 조금 더 넓혀서 여유롭게 */
  margin: 30px auto;
  box-sizing: border-box;

  /* 💡 [핵심] 메인 카드와 동일한 깊고 부드러운 그림자 */
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
}

.challenge-modify-container p {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b; /* 메인 제목과 같은 딥 블루 그레이 */
  margin-top: 32px;
  margin-bottom: 12px;
}

/* 3. 하단 버튼 영역 */
.challenge-modify-container footer {
  margin-top: 40px; /* 메모 입력창과 하단 버튼 사이를 시원하게 띄워줍니다 */
}

.modify-action-buttons {
  display: flex;
  justify-content: space-between; /* 양 끝으로 밀어내기! */
  align-items: center;
  margin-top: 40px;
}

/* AppButton 내부의 btn-wrapper가 기본적으로 오른쪽 정렬(flex-end)을 하고 있어서,
   공간을 골고루 차지하도록 살짝 너비를 줍니다. */
.modify-action-buttons > div {
  flex: 1; /* 두 버튼이 반반씩 영역을 가지도록 */
}

/* 첫 번째 버튼(취소)은 왼쪽으로 찰싹 붙이기 */
.modify-action-buttons > div:first-child {
  justify-content: flex-start;
}
</style>
