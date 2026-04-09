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
import { useRoute, useRouter } from 'vue-router';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();
const router = useRouter();

const challengeData = ref({
  title: '',
  tag: '식비',
  targetAmount: 0,
  type: '지출',
});

const memoText = ref('');

const handleSave = async () => {
  console.log('저장 버튼 클릭됨');

  const now = new Date();

  const newChallenge = {
    title: challengeData.value.title,
    tag: challengeData.value.tag,
    targetAmount: challengeData.value.targetAmount * 10000,
    type: challengeData.value.type,
    currentAmount: 0,
    year: now.getFullYear(), // 💡 오타 수정 1: 괄호 () 추가
    month: now.getMonth() + 1,
    userId: 1,
    memo: memoText.value,
  };

  try {
    const response = await fetch('http://localhost:3000/challenges', {
      method: 'POST',
      headers: {
        // 💡 오타 수정 2: header -> headers (s 추가)
        'Content-Type': 'application/json', // 💡 오타 수정 3: content=Type -> Content-Type
      },
      body: JSON.stringify(newChallenge),
    });

    if (!response.ok) throw new Error('에러 발생 1');

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
