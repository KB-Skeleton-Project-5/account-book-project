<template>
  <DefaultLayout>
    <AppHeader title="챌린지 MODIFY" :back="true" backTo="challenges" />
    <div v-if="isDataLoaded" class="challenge-modify-container">
      <ChallengeSetup v-model="challengeData" />
      <p>메모</p>
      <MemoWrite v-model="memoText" />
      <footer>
        <AppButton type="single" @click="handleUpdate" />
      </footer>
    </div>
    <div v-else style="text-align: center; padding: 50px; color: #666">
      <p>기존 챌린지 정보를 불러오는 중입니다... 🏃‍♂️💨</p>
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

const route = useRoute();
const router = useRouter();

const challengeData = ref({
  title: '',
  tag: '식비',
  targetAmount: 0,
  type: '지출',
});

const memoText = ref('');

const isDataLoaded = ref(false);

const challengeId = route.params.id;

const fetchOldData = async () => {
  try {
    const response = await axios.get(`/api/challengesdb/${challengeId}`);

    const oldData = response.data;

    console.log('가져온 예전 데이터:', oldData);

    if (!oldData) {
      alert('챌린지 불러오기 오류');
      router.push({ name: 'challenges' });
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
    console.error('데이터 불러오기 오류:', error);
    alert('데이터 불러오기 오류');
    router.push({ name: 'challenges' });
  }
};

onMounted(() => {
  fetchOldData();
});

const handleUpdate = async () => {
  const now = new Date();

  const updatedChallenge = {
    title: challengeData.value.title,
    tag: challengeData.value.tag,
    targetAmount: challengeData.value.targetAmount * 10000,
    type: challengeData.value.type,
    memo: memoText.value,
    currentAmount: 0,
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    userId: 1,
  };

  try {
    await axios.put(`/api/challengesdb/${challengeId}`, updatedChallenge);

    console.log('챌린지 수정 완료!');

    router.push({ name: 'challenges/info', params: { id: challengeId } });
  } catch (error) {
    console.error('수정 실패:', error);
    alert('수정에 실패했습니다.');
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
