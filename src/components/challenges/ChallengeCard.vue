<template>
  <div class="challenge-card">
    <header>
      <h2>{{ challenge.title }}</h2>
    </header>

    <ProgressBar
      :current="challenge.currentAmount"
      :total="challenge.targetAmount"
      :type="challenge.type"
    />

    <ChallengeDescription
      :tag="challenge.tag"
      :targetAmount="challenge.targetAmount / 10000"
      :type="challenge.type"
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
    default: () => ({
      title: '챌린지 1',
      tag: '교통비',
      currentAmount: 0,
      targetAmount: 1,
      type: '지출',
    }),
  },
  type: { type: String, default: '지출' },
});

const percentage = computed(() => {
  if (props.challenge.targetAmount === 0) return 0;
  return (props.challenge.currentAmount / props.challenge.targetAmount) * 100;
});

const challengeResult = computed(() => {
  const rawValue = Math.floor(percentage.value);

  if (props.challenge.type === '지출') {
    return rawValue > 100 ? '목표 실패!' : `${rawValue}%`;
  }

  if (props.challenge.type === '수입') {
    return rawValue >= 100 ? '목표 성공!' : `${rawValue}%`;
  }

  return `${rawValue}%`;
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
