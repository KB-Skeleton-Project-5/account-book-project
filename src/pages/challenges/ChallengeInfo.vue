<template>
  <DefaultLayout>
    <AppHeader title="챌린지 INFO" :back="true" backTo="challenges" />
    <div class="challenge-info">
      <header>
        <h2>{{ challenge.challengeName }}</h2>
        <AppButton class="high-right-button" />
      </header>
      <ProgressBar :current="challenge.current" :total="challenge.total" />
      <ChallengeDescription />
      <p>메모</p>
      <MemoDisplay />
      <footer class="low-button">
        <AppButton />
        <AppButton class="low-right-button" />
      </footer>
    </div>
    <AppFooter />
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppButton from '@/components/commons/AppButton.vue';
import ProgressBar from '@/components/challenges/ProgressBar.vue';
import ChallengeDescription from '@/components/challenges/ChallengeDescription.vue';
import MemoDisplay from '@/components/challenges/MemoDisplay.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const props = defineProps({
  challenge: {
    type: Object,
    required: true,
    default: () => ({ challengeName: '챌린지', current: 0, total: 1 }),
  },
  challengeType: { type: String, default: '지출' },
});

const percentage = computed(() => {
  if (props.challenge.total === 0) return 0;
  return (props.challenge.current / props.challenge.total) * 100;
});

const challengeResult = computed(() => {
  const rawValue = Math.floor(percentage.value);

  if (props.challengeType === '지출') {
    return rawValue > 100 ? '목표 실패!' : `${rawValue}`;
  }

  if (props.challengeType === '수입') {
    return rawValue >= 100 ? '목표 성공!' : `${rawValue}`;
  }

  return `${rawValue}`;
});
</script>

<style>
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
