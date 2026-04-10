<template>
  <DefaultLayout>
    <div class="info-viewport">
      <AppHeader title="챌린지 INFO" :back="true" backTo="challenges" />

      <main class="info-content">
        <div class="challenge-info">
          <header>
            <h2>{{ challenge.title }}</h2>
            <AppButton
              type="history"
              text="내역"
              @click="handleHistory"
              class="high-button"
            />
          </header>

          <ProgressBar
            :current="challenge.currentAmount"
            :total="challenge.targetAmount"
            :type="challenge.type"
          />

          <ChallengeDescription
            :tag="challenge.tag"
            :targetAmount="challenge.targetAmount / 10000"
            :type="challenge.type"
          />

          <p>메모</p>
          <MemoDisplay :memo="challenge.memo" />

          <footer class="low-button">
            <AppButton
              type="edit-delete"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </footer>
        </div>
      </main>

      <AppFooter />
    </div>

    <DeleteConfirm
      v-if="isModalOpen"
      @left="cancelDelete"
      @right="confirmDelete"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '@/components/commons/AppButton.vue';
import ProgressBar from '@/components/challenges/ProgressBar.vue';
import ChallengeDescription from '@/components/challenges/ChallengeDescription.vue';
import MemoDisplay from '@/components/challenges/MemoDisplay.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil.js';

const route = useRoute();
const router = useRouter();
const userInfo = getUserInfo();

const challenge = ref({
  title: '',
  tag: '',
  currentAmount: 0,
  targetAmount: 1,
  type: '지출',
  memo: '',
});

const getChallengeInfo = async () => {
  const challengeId = route.params.id;
  console.log(`${challengeId}번 챌린지 상세 정보 요청`);

  try {
    const challengeRes = await axios.get(`/api/challenges/${challengeId}`);
    const challengeData = challengeRes.data;

    // if (String(challengeData.userId) !== String(userInfo.id)) {
    //   alert('다른 사용자의 챌린지에는 접근할 수 없습니다.');
    //   router.push({ name: 'challenges' });
    //   return;
    // }
    const formattedMonth = String(challengeData.month).padStart(2, '0');
    const targetYearMonth = `${challengeData.year}-${formattedMonth}`;

    const expensesRes = await axios.get(`/api/expenses`, {
      params: userInfo?.id ? { userId: userInfo.id } : {},
    });
    const myExpenses = expensesRes.data;

    const calculatedAmount = myExpenses.reduce((totalSum, expense) => {
      if (!expense.type || !expense.tag) return totalSum;

      const expTypeTitle = expense.type.typetitle || expense.type;
      const expTagTitle = expense.tag.tagtitle || expense.tag;

      const isSameMonth =
        expense.date && expense.date.includes(targetYearMonth);

      // 💡 여기서 모두 'challengeData'를 사용해서 비교하도록 통일했습니다!
      const isSameType = expTypeTitle === challengeData.type;
      const isSameTag =
        challengeData.tag === '전체' || expTagTitle === challengeData.tag;

      if (isSameMonth && isSameType && isSameTag) {
        return totalSum + Number(expense.amount);
      }
      return totalSum;
    }, 0);

    challengeData.currentAmount = calculatedAmount;

    // 계산이 다 끝난 완벽한 데이터를 드디어 화면에 보이는 'challenge'에 넣어줍니다.
    challenge.value = challengeData;
  } catch (error) {
    console.error('상세 정보 및 지출 내역 합산 실패', error);
  }
};

onMounted(() => {
  getChallengeInfo();
});

const percentage = computed(() => {
  if (!challenge.value.targetAmount || challenge.value.targetAmount === 0)
    return 0;
  return (challenge.value.currentAmount / challenge.value.targetAmount) * 100;
});

const challengeResult = computed(() => {
  const rawValue = Math.floor(percentage.value);
  if (challenge.value.type === '지출' || challenge.value.type === 'SPENDING') {
    return rawValue > 100 ? '목표 실패!' : `${rawValue}%`;
  }
  if (challenge.value.type === '수입' || challenge.value.type === 'INCOME') {
    return rawValue >= 100 ? '목표 성공!' : `${rawValue}%`;
  }
  return `${rawValue}%`;
});

const handleHistory = () => {
  console.log('내역 버튼 클릭됨');
  const year = challenge.value.year;
  const month = challenge.value.month;

  const lastDay = new Date(year, month, 0).getDate();
  const formattedMonth = String(month).padStart(2, '0');

  const startDate = `${year}-${formattedMonth}-01`;
  const endDate = `${year}-${formattedMonth}-${String(lastDay).padStart(2, '0')}`;

  const queryParams = {
    startDate: startDate,
    endDate: endDate,
    type: challenge.value.type || '지출',
  };

  if (challenge.value.tag !== '전체') {
    const tagMap = {
      식비: 'eat',
      교통비: 'traffic',
      쇼핑: 'shopping',
      기타: 'etc',
    };
    queryParams.tags = tagMap[challenge.value.tag] || challenge.value.tag;
  }

  router.push({
    name: 'expenses',
    query: queryParams,
  });
};

const handleEdit = () => {
  console.log('수정 버튼 클릭됨');
  router.push({
    name: 'challenges/modify',
    params: { id: route.params.id },
  });
};

const isModalOpen = ref(false);

const handleDelete = () => {
  console.log('삭제 버튼 클릭됨');
  isModalOpen.value = true;
};

const cancelDelete = () => {
  isModalOpen.value = false;
};

const confirmDelete = async () => {
  const challengeId = route.params.id;
  if (!challengeId || challengeId === 'undefined') {
    alert('삭제 대상 오류');
    return;
  }

  try {
    await axios.delete(`/api/challenges/${challengeId}`);
    console.log('삭제 완료, id:', challengeId);
    isModalOpen.value = false;
    router.push({ name: 'challenges' });
  } catch (error) {
    console.error('삭제 실패 에러:', error);
    alert('삭제 실패');
  }
};
</script>

<style scoped>
.page-viewport {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 💡 화면 전체 높이를 확보 */
}

.page-content {
  flex: 1; /* 💡 핵심: 푸터를 제외한 나머지 공간을 꽉 채워서 푸터를 바닥으로 밀어냄 */
}
/* 1. 하얀색 메인 카드 (컨테이너) */
.challenge-info {
  width: calc(100% - 40px);
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 20px; /* 카드와 동일하게 20px */
  padding: 24px;
  margin: 20px auto;
  box-sizing: border-box;

  /* 💡 카드와 동일한 깊고 부드러운 그림자 */
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
}

/* 2. 헤더 영역 (제목과 내역 버튼) */
.challenge-info header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* 3. 💡 [통일 핵심] 메인 제목 (4월 교통비 절약) */
.challenge-info header h2 {
  margin: 0;
  /* ChallengeCard와 완벽 동기화 */
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b; /* 세련된 딥 블루 그레이 */
  letter-spacing: -0.03em; /* 쫀득한 자간 */
}

/* 4. 💡 [통일 핵심] '메모' 같은 중간 타이틀 (p 태그) */
.challenge-info p {
  /* ChallengeCard 내의 텍스트 위계와 맞춤 */
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 32px;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

/* 5. 💡 하단 버튼 영역 (수정/삭제 버튼 사이 간격 조절) */
.low-button {
  margin-top: 40px;
  /* 버튼들이 너무 붙어있지 않게 여유를 줍니다 */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 6. 메모 디스플레이 (MemoDisplay 컴포넌트 주변 여백) */
:deep(.memo-display-container) {
  /* 메모 컴포넌트 내부 스타일이 카드와 어울리도록 조절 */
  border-radius: 12px;
  background-color: #f8fafc; /* 연한 회색 배경 */
}
</style>
