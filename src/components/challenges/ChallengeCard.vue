<template>
  <div class="challenge-card" :class="{ 'is-past': isPastChallenge }">
    <div class="percentage-badge" :style="badgeStyle">
      {{ challengeResult }}
    </div>

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
  },
});

const isPastChallenge = computed(() => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const challengeYear = Number(props.challenge.year);
  const challengeMonth = Number(props.challenge.month);

  return (
    challengeYear < currentYear ||
    (challengeYear === currentYear && challengeMonth < currentMonth)
  );
});

const percentage = computed(() => {
  const target = Number(props.challenge.targetAmount);
  if (target === 0) return 0;
  return (Number(props.challenge.currentAmount) / target) * 100;
});

const challengeResult = computed(() => {
  const rawValue = Math.floor(percentage.value);
  const type = props.challenge.type;
  const current = Number(props.challenge.currentAmount);
  const target = Number(props.challenge.targetAmount);

  if (isPastChallenge.value) {
    if (type === '지출') {
      return current < target ? '목표 달성!' : '목표 실패!';
    } else {
      return current >= target ? '목표 달성!' : '목표 실패!';
    }
  }

  if (type === '지출') {
    return rawValue >= 100 ? '목표 실패!' : `${rawValue}%`;
  }

  if (type === '수입') {
    return rawValue >= 100 ? '목표 달성!' : `${rawValue}%`;
  }

  return `${rawValue}%`;
});

const badgeStyle = computed(() => {
  const perc = percentage.value;
  const type = props.challenge.type;
  const result = challengeResult.value;

  if (result === '목표 달성!')
    return { backgroundColor: '#64B5F6', color: '#ffffff' };
  if (result === '목표 실패!')
    return { backgroundColor: '#7D1A1A', color: '#ffffff' };

  let backgroundColor = '#f0f0f0';
  let color = '#333333';

  if (type === '수입') {
    if (perc < 30) backgroundColor = '#E57373';
    else if (perc < 70) backgroundColor = '#ffcc00';
    else backgroundColor = '#66A882';
  } else {
    if (perc < 30) backgroundColor = '#66A882';
    else if (perc < 70) backgroundColor = '#ffcc00';
    else backgroundColor = '#E57373';
  }

  if (perc >= 70 || perc < 30) color = '#ffffff';

  return { backgroundColor, color };
});
</script>

<style scoped>
.challenge-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  position: relative;
  font-family:
    'Pretendard',
    -apple-system,
    sans-serif;
}

.challenge-card header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.03em;
  padding-right: 100px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.percentage-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
}

.challenge-card :deep(.ChallengeDescription h5) {
  margin-top: 20px;
  margin-bottom: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #666666;
  line-height: 1.5;
}

.challenge-card.is-past {
  opacity: 0.6;
  filter: grayscale(20%);
}
</style>
