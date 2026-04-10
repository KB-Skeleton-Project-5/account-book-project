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
    <DeleteConfirm
      v-if="isModalOpen"
      @left="cancelDelete"
      @right="confirmDelete"
    />
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
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';
import axios from 'axios';

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

const getChallengeInfo = async () => {
  const challengeId = route.params.id;
  console.log(`${challengeId}번 챌린지 상세 정보 요청`);

  try {
    const response = await axios.get(`/api/challengesdb/${challengeId}`);

    challenge.value = response.data;
  } catch (error) {
    console.error('상세 정보 실패', error);
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
  router.push({
    name: 'expenses',
    query: {
      year: challenge.value.year,
      month: challenge.value.month,
      tag: challenge.value.tag,
    },
  });
};

const handleEdit = () => {
  console.log('수정 버튼 클릭됨');
  const challengeId = route.params.id;
  router.push({
    name: 'challenges/modify',
    params: { id: challengeId },
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
    console.error('id 없음');
    alert('삭제 대상 오류');
    return;
  }

  try {
    await axios.delete(`/api/challengesdb/${challengeId}`);

    console.log('삭제 완료, id:', challengeId);

    isModalOpen.value = false;
    router.push({ name: 'challenges' });
  } catch (error) {
    console.error('삭제 실패 에러:', error);
    alert('삭제 실패');
  }
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
