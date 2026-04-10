<template>
  <DefaultLayout>
    <AppHeader title="챌린지 ADD" :back="true" backTo="challenges" />
    <div class="challenge-add-container">
      <ChallengeSetup v-model="challengeData" />
      <p>메모</p>
      <MemoWrite v-model="memoText" />
      <footer class="add-action-buttons">
        <AppButton type="history" text="취소" @click="handleCancel" />
        <AppButton type="single" text="저장" @click="handleSave" />
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
import { getUserInfo } from '@/util/authUtil.js';

const router = useRouter();
const userInfo = getUserInfo();

const challengeData = ref({
  title: '',
  tag: '전체',
  targetAmount: 0,
  type: '지출',
});

const memoText = ref('');

const handleCancel = () => {
  console.log('취소 버튼 클릭됨');
  router.push({ name: 'challenges' });
};

const handleSave = async () => {
  console.log('저장 버튼 클릭됨');

  // if (!userInfo.authenticated) {
  //   alert('로그인 필요');
  //   router.push({ name: 'users/login' });
  //   return;
  // }

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
    userId: userInfo.id,
    memo: memoText.value,
  };

  try {
    await axios.post('/api/challenges', newChallenge);

    console.log('새 챌린지 등록 완료');
    router.push({ name: 'challenges' });
  } catch (error) {
    console.error('등록 실패 에러', error);
    alert('등록 실패');
  }
};
</script>

<style scoped>
/* 1. 하얀색 메인 도화지 (컨테이너) */
.challenge-add-container {
  background-color: #ffffff;
  border-radius: 16px; /* 둥근 모서리 */
  padding: 24px; /* 안쪽 여백 */
  margin: 20px auto; /* 가운데 정렬 및 위아래 바깥 여백 */

  max-width: 400px; /* 너무 넓어지지 않도록 고정 */
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 부드러운 그림자 */
}

/* 2. '메모' 글자 (p 태그) */
.challenge-add-container p {
  font-size: 15px;
  font-weight: bold;
  color: #333333;
  margin-top: 32px; /* 위쪽 챌린지 설정(ChallengeSetup)과의 넉넉한 간격 */
  margin-bottom: 12px; /* 아래 메모 입력창(MemoWrite)과의 간격 */
}

/* 3. 하단 버튼 영역 */
.challenge-add-container footer {
  margin-top: 40px; /* 메모 입력창과 하단 버튼 사이를 시원하게 띄워줍니다 */
}

.add-action-buttons {
  display: flex;
  justify-content: space-between; /* 양 끝으로 밀어내기! */
  align-items: center;
  margin-top: 40px;
}

/* AppButton 내부의 btn-wrapper가 기본적으로 오른쪽 정렬(flex-end)을 하고 있어서,
   공간을 골고루 차지하도록 살짝 너비를 줍니다. */
.add-action-buttons > div {
  flex: 1; /* 두 버튼이 반반씩 영역을 가지도록 */
}

/* 첫 번째 버튼(취소)은 왼쪽으로 찰싹 붙이기 */
.add-action-buttons > div:first-child {
  justify-content: flex-start;
}
</style>
