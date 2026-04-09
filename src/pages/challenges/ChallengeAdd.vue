<template>
  <AppHeader title="챌린지 ADD" :back="true" backTo="challenges" />
  <div class="challenge-add-container">
    <ChallengeSetup v-model="challengeData" />
    <p>메모</p>
    <MemoWrite />
    <footer>
      <AppButton
        type="edit-delete"
        leftText="저장"
        @edit="handleSave"
        @delete="handleDelete"
      />
    </footer>
  </div>
  <AppFooter />
</template>

<script setup>
import { ref } from 'vue';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const challengeData = ref({
  challengeName: '',
  tag: '식비',
  targetAmount: 0,
  type: '지출',
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #fde8a2;
  height: 100%;
}
footer {
  display: flex;
}
.challenge-add-container {
  background-color: white;
  border: 5px solid black;
  min-height: 400px;
}
</style>
