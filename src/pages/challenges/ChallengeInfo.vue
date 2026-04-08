<template>
  <div class="challenge-info">
    <header>
      <h2>{{ challengeName }}</h2>
      <Button class="high-right-button" />
    </header>
    <ProgressBar />
    <ChallengeDescription />
    <p>메모</p>
    <MemoDisplay />
    <footer class="low-button">
      <CustomButton label="수정" />
      <CustomButton label="삭제" class="low-right-button" />
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CustomButton from '@/components/commons/CustomButton.vue';
import ProgressBar from '@/components/challenges/ProgressBar.vue';
import ChallengeDescription from '@/components/challenges/ChallengeDescription.vue';
import MemoDisplay from '@/components/challenges/MemoDisplay.vue';

const challengeName = '목표 1';
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #fde8a2;
  height: 100%;
}
header {
  display: flex;
}
.high-right-button {
  margin-left: auto;
}
.challenge-info {
  background-color: white;
  border: 5px solid black;
  min-height: 400px;
}

.low-button {
  display: flex;
}

.low-right-button {
  margin-left: auto;
}
</style>
