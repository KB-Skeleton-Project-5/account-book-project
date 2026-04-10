<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="챌린지 MODIFY" :back="true" backTo="challenges" />
    </template>

    <div class="modify-container">
      <div v-if="isDataLoaded" class="challenge-modify-card">
        <ChallengeSetup v-model="challengeData" />

        <p class="section-title">메모</p>
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
/* 💡 레이아웃: 이제 수동 높이 계산(100vh)이나 flex-1은 필요 없습니다! */

.modify-container {
  padding: 20px 0; /* 상하 여백으로 카드 배치 최적화 */
}

/* 🎨 카드 디자인 통일 (Add/Info 페이지와 완벽 동기화) */
.challenge-modify-card {
  width: calc(100% - 40px);
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 32px;
  margin: 0 auto;
  box-sizing: border-box;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
}

/* 섹션 타이틀 (메모 등) */
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 32px;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

/* 버튼 그룹 레이아웃 */
.modify-action-buttons {
  display: flex;
  gap: 12px; /* 버튼 사이 간격 */
  margin-top: 40px;
}

/* 로딩 상태 스타일 */
.loading-state {
  text-align: center;
  padding: 50px;
  color: #64748b;
  font-weight: 500;
}
</style>
