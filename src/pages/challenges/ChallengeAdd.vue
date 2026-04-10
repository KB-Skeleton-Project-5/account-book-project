<template>
  <DefaultLayout>
    <AppHeader title="챌린지 ADD" :back="true" backTo="challenges" />
    <div class="challenge-add-container">
      <ChallengeSetup v-model="challengeData" />
      <p>메모</p>
      <MemoWrite v-model="memoText" />
      <footer>
        <AppButton type="single" @click="handleSave" />
      </footer>
    </div>
    <AppFooter />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import axios from 'axios';

const router = useRouter();

const challengeData = ref({
  title: '',
  tag: '전체',
  targetAmount: 0,
  type: '지출',
});

const memoText = ref('');

const handleSave = async () => {
  console.log('저장 버튼 클릭됨');

  const now = new Date();

  if (!challengeData.value.title || challengeData.value.title.trim() === '') {
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
  console.log('제목/목표 금액 검사 완료');

  const newChallenge = {
    title: challengeData.value.title,
    tag: challengeData.value.tag,
    targetAmount: challengeData.value.targetAmount * 10000,
    type: challengeData.value.type,
    currentAmount: 0,
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    userId: 1,
    memo: memoText.value,
  };

  try {
    await axios.post('/api/challengesdb', newChallenge);

    console.log('새 챌린지 등록 완료');
    router.push({ name: 'challenges' });
  } catch (error) {
    console.error('등록 실패 에러', error);
    alert('등록 실패');
  }
};
</script>

<style>
.challenge-add-container {
  background-color: white;
  border: 5px solid black;
  min-height: 400px;
}
</style>
