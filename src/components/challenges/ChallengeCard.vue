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
.percentage {
  align-self: flex-end;
}
/* ChallengeCard.vue 의 style scoped 내부 */

/* (클래스 이름은 실제 코드에 맞게 변경해 주세요) */
.challenge-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;

  /* 💡 Info 화면과 완벽히 동일한 상하좌우 그림자를 여기에 줍니다! */
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);

  box-sizing: border-box;
}
</style>
