<template>
  <div class="challenge-card">
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

// 1. 현재 챌린지가 '지난 달' 것인지 판별하는 계산기 📅
const isPastChallenge = computed(() => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 연도가 이전이거나, 연도는 같은데 월이 이전인 경우
  return (
    props.challenge.year < currentYear ||
    (props.challenge.year === currentYear &&
      props.challenge.month < currentMonth)
  );
});

const percentage = computed(() => {
  if (props.challenge.targetAmount === 0) return 0;
  return (props.challenge.currentAmount / props.challenge.targetAmount) * 100;
});

// 2. 💡 [핵심] 과거 여부에 따라 텍스트를 결정하는 로직
const challengeResult = computed(() => {
  const rawValue = Math.floor(percentage.value);
  const type = props.challenge.type;
  const current = props.challenge.currentAmount;
  const target = props.challenge.targetAmount;

  // 🚨 과거 챌린지라면? 무조건 성공/실패만 따집니다.
  if (isPastChallenge.value) {
    if (type === '지출') {
      return current <= target ? '목표 성공!' : '목표 실패!';
    } else {
      return current >= target ? '목표 성공!' : '목표 실패!';
    }
  }

  // 🏃 현재 진행 중인 챌린지라면? 기존처럼 퍼센트 위주로 보여줍니다.
  if (type === '지출') {
    return rawValue > 100 ? '목표 실패!' : `${rawValue}%`;
  }
  if (type === '수입') {
    return rawValue >= 100 ? '목표 성공!' : `${rawValue}%`;
  }
  return `${rawValue}%`;
});

// 3. 🎨 [색상 동기화] 성공 시 하늘색, 실패 시 빨간색!
const badgeStyle = computed(() => {
  const perc = percentage.value;
  const type = props.challenge.type;
  const result = challengeResult.value;

  // 💡 성공/실패 텍스트가 떴을 때의 공통 색상 (과거/현재 공통)
  if (result === '목표 성공!')
    return { backgroundColor: '#64B5F6', color: '#ffffff' }; // 하늘색
  if (result === '목표 실패!')
    return { backgroundColor: '#7D1A1A', color: '#ffffff' }; // 진빨강

  // 💡 그 외 진행 중인 퍼센트 색상 로직
  let backgroundColor = '#f0f0f0';
  let color = '#333333';

  if (type === '수입') {
    if (perc < 30) backgroundColor = '#E57373';
    else if (perc < 70) backgroundColor = '#ffcc00';
    else backgroundColor = '#66A882';
    color = perc < 70 && perc >= 30 ? '#333333' : '#ffffff';
  } else {
    if (perc < 30) backgroundColor = '#66A882';
    else if (perc < 70) backgroundColor = '#ffcc00';
    else backgroundColor = '#E57373';
    color = perc < 70 && perc >= 30 ? '#333333' : '#ffffff';
  }

  return { backgroundColor, color };
});
</script>

<style scoped>
/* 1. 카드 전체 컨테이너 (기존 유지하되 글꼴 가독성 높이기) */
.challenge-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); /* 더 넓고 부드러운 그림자 */
  box-sizing: border-box;
  position: relative;
  font-family:
    'Pretendard',
    -apple-system,
    sans-serif; /* 깔끔한 폰트 적용 권장 */
}

/* 💡 [리팩토링 핵심] 2. 메인 제목 (4월 교통비 절약 🚗) */
.challenge-card header h2 {
  margin: 0;
  font-size: 1.35rem; /* 살짝 키워서 시원하게 */
  font-weight: 800; /* 두께는 유지하되 */

  /* 🎨 [색상 포인트] 완전 검정 계열 대신, 세련된 딥 블루 그레이(Slate 800) 적용 */
  color: #1e293b;

  /* 🎨 [자간 포인트] 자간을 더 과감히 줄여(-0.03em) 응축된 느낌 극대화 */
  letter-spacing: -0.03em;

  padding-right: 100px;
  margin-bottom: 30px;

  /* 💡 만약 제목 앞에 이모지를 붙이신다면 아래 코드를 사용해 보세요! (HTML 템플릿에 이모지 추가 필요) */
  display: flex;
  align-items: center;
  gap: 8px; /* 이모지와 글자 사이 간격 */
}

/* 3. 퍼센트 뱃지 글자 (11%) */
.percentage-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 6px 14px;
  border-radius: 10px;

  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  /* 💡 뱃지 내부 글자 그림자를 제거하거나 아주 미세하게 주어 깔끔하게 유지 */
  line-height: 1.2;
}

/* 4. 하단 상세 설명 (교통비에서 20만원 이하 지출) */
/* ChallengeDescription.vue 내부 혹은 클래스 직접 지정 */
.challenge-card :deep(.ChallengeDescription h5) {
  margin-top: 20px;
  margin-bottom: 0;
  font-size: 0.95rem; /* 제목보다 작게 */
  font-weight: 500; /* 중간 굵기 */
  color: #666666; /* 부드러운 회색으로 위계 조절 */
  line-height: 1.5;
}

/* 5. 금액 표시 (ProgressBar.vue 내부의 2만원, 20만원 글자들) */
/* 프로그레스바 아래 숫자들에 적용해 보세요 */
.amount-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #999999; /* 가장 낮은 단계의 회색 */
}
</style>
