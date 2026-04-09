<template>
  <DefaultLayout>
    <AppHeader title="챌린지 INFO" :back="true" backTo="challenges" />
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
      />

      <ChallengeDescription
        :tag="challenge.tag"
        :targetAmount="challenge.targetAmount / 10000"
        :challengeType="challenge.type"
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
    <AppFooter />
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

const route = useRoute();
const router = useRouter();

const challenge = ref({
  title: '불러오는 중...',
  tag: '',
  currentAmount: 0,
  targetAmount: 1,
  type: '지출',
  memo: '',
});

const fetchChallengeInfo = async () => {
  const challengeId = route.params.id;
  console.log(`${challengeId}번 챌린지 상세 정보 요청`);

  try {
    const response = await fetch(
      `http://localhost:3000/challenges/${challengeId}`,
    );
    if (!response.ok) throw new Error('서버 통신 불량!');

    const data = await response.json();
    challenge.value = data; // 서버가 준 진짜 데이터로 그릇을 채웁니다!
  } catch (error) {
    console.error('상세 정보 실패', error);
  }
};

onMounted(() => {
  fetchChallengeInfo();
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
  router.push({ name: 'expenses' });
};

const handleEdit = () => {
  console.log('수정 버튼 클릭됨');
  const challengeId = route.params.id;
  router.push({
    name: 'challenges/modify',
    params: { id: challengeId },
  });
};

const handleDelete = () => {
  console.log('삭제 버튼 클릭됨');
  router.push({ name: 'challenges' });
};
</script>

<style>
header {
  display: flex;
}
.high-button {
  margin-left: auto;
}
.challenge-info {
  background-color: white;
  border: 5px solid black;
  min-height: 400px;
}
</style>
