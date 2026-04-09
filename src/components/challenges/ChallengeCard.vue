<template>
  <div class="challenge-card">
    <header>
      <h2>{{ challenge.challengeName }}</h2>
    </header>

    <ProgressBar :current="challenge.current" :total="challenge.total" />

    <ChallengeDescription
      :targetAmount="challenge.total"
      :challengeType="challengeType"
    />

    <div class="percentage">{{ challengeResult }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProgressBar from './ProgressBar.vue';
import ChallengeDescription from './ChallengeDescription.vue';

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

<style scoped>
.challenge-card {
  display: flex;
  flex-direction: column;
  border: 5px solid black;
  background-color: white;
}
.percentage {
  align-self: flex-end;
}
</style>
