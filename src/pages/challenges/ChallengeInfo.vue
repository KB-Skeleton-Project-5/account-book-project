<template>
  <DefaultLayout>
    <AppHeader title="챌린지 INFO" :back="true" backTo="challenges" />
    <div class="challenge-info">
      <header>
        <h2>{{ challenge.challengeName }}</h2>
        <AppButton
          type="history"
          text="내역"
          @click="handleHistory"
          class="high-button"
        />
      </header>
      <ProgressBar :current="challenge.current" :total="challenge.total" />
      <ChallengeDescription
        :tag="challenge.tag"
        :targetAmount="challenge.total"
        :challengeType="challengeType"
      />
      <p>메모</p>
      <MemoDisplay />
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
  challengeName: '불러오는 중...',
  current: 0,
  total: 1,
});

const challengeType = ref('지출');

onMounted(() => {
  const challengeId = route.params.id; // URL에서 id를 꺼냅니다.

  // 💡 실제로는 여기서 서버나 Pinia(상태관리)에서 id에 맞는 데이터를 가져와야 합니다.
  // 지금은 눈으로 확인하기 위해 임시 데이터를 넣어보겠습니다!
  challenge.value = {
    challengeName: '목표 1',
    tag: '기타',
    current: 23,
    total: 50,
  };
});

const percentage = computed(() => {
  if (challenge.value.total === 0) return 0;
  return (challenge.value.current / challenge.value.total) * 100;
});

const challengeResult = computed(() => {
  const rawValue = Math.floor(percentage.value);

  if (challengeType.value === '지출') {
    return rawValue > 100 ? '목표 실패!' : `${rawValue}`;
  }

  if (challengeType.value === '수입') {
    return rawValue >= 100 ? '목표 성공!' : `${rawValue}`;
  }

  return `${rawValue}`;
});

const handleHistory = () => {
  console.log('내역 페이지로 이동합니다!');
  // 여기에 router.push 등의 로직을 넣으면 되겠죠?
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
