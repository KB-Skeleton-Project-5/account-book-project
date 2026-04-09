<template>
  <div class="challenge-add-container">
    <header>
      <input type="text" placeholder="새 목표 1" />
    </header>
    <ChallengeSetup />
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
</template>

<script setup>
import { ref } from 'vue';
import ChallengeSetup from '@/components/challenges/ChallengeSetup.vue';
import MemoWrite from '@/components/challenges/MemoWrite.vue';
import AppButton from '@/components/commons/AppButton.vue';
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
