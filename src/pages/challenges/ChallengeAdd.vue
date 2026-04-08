<template>
  <div class="challenge-add-container">
    <header>
      <input type="text" placeholder="새 목표 1" />
    </header>
    <ChallengeSetup />
    <p>메모</p>
    <MemoWrite />
    <footer>
      <CustomButton label="취소"/><CustomButton label="저장" class="low-right-button" />
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import CustomButton from '@/components/commons/CustomButton.vue';

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

.low-right-button {
  margin-left: auto;
}
</style>
