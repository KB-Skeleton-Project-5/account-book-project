<template>
  <DefaultLayout>
    <AppHeader title="챌린지 MODIFY" :back="true" backTo="challenges" />
    <div class="challenge-add-container">
      <ChallengeSetup v-model="challengeData" />
      <p>메모</p>
      <MemoWrite />
      <footer>
        <AppButton
          type="edit-delete"
          @edit="handleSave"
          @delete="handleDelete"
        />
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

const router = useRouter();
const route = useRoute();

const challengeData = ref({
  challengeName: '',
  tag: '식비',
  targetAmount: 0,
  type: '지출',
});

const handleSave = () => {
  console.log('수정 버튼(실제론 저장) 클릭됨');
  const challengeId = route.params.id;

  router.push({
    name: 'challenges/info',
    params: { id: challengeId },
  });
};

const handleDelete = () => {
  console.log('삭제 버튼 클릭됨');

  router.push({
    name: 'challenges',
  });
};
</script>

<style>
.challenge-add-container {
  background-color: white;
  border: 5px solid black;
  min-height: 400px;
}
</style>
