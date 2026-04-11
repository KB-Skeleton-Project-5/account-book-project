<template>
  <div class="progress-container" :class="statusClass">
    <div class="track">
      <div class="fill" :style="fillStyle">
        <div class="indicator-dot" :style="{ borderColor: dotColor }"></div>
      </div>
    </div>

    <div class="labels-container" :class="{ 'is-near-end': isNearEnd }">
      <div
        class="label moving-label"
        :style="movingLabelStyle"
        :class="{
          'text-success': !isOver && isSuccess,
          'zero-align': movingLabelPos === 0,
        }"
      >
        {{ isOver ? formatManwon(total) : formatManwon(current) }}만원
      </div>

      <div
        class="label end-label"
        :class="{
          'text-danger': isDanger,
          'text-success': isOver && isSuccess,
        }"
      >
        {{ isOver ? formatManwon(current) : formatManwon(total) }}만원
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  type: { type: String, default: '지출' },
});

// 💡 [핵심] 애니메이션을 위해 실제 화면에 보여줄 '가짜' 현재값을 만듭니다.
// 처음엔 0으로 시작해서, 화면에 나타나는 순간 실제 current값까지 달려갈 거예요!
const displayCurrent = ref(0);

onMounted(() => {
  // 🏎️ 화면에 마운트되자마자 실제 값으로 업데이트! (CSS transition이 실행됩니다)
  setTimeout(() => {
    displayCurrent.value = props.current;
  }, 50); // 아주 미세한 지연을 주어 애니메이션이 확실히 보이게 합니다.
});

const formatManwon = (amount) => Math.floor(amount / 10000);

// 💡 모든 계산 로직에서 props.current 대신 displayCurrent를 사용하도록 변경합니다.
const isOver = computed(() => displayCurrent.value > props.total);
const isSuccess = computed(
  () => props.type === '수입' && displayCurrent.value >= props.total,
);
const isDanger = computed(() => props.type === '지출' && isOver.value);

const statusClass = computed(() => {
  if (isSuccess.value) return 'is-success';
  if (isDanger.value) return 'is-danger';
  return 'is-normal';
});

const dotColor = computed(() => {
  if (isSuccess.value) return isOver.value ? '#059669' : '#10b981';
  if (isDanger.value) return '#cc0000';
  return '#3b82f6';
});

const movingLabelPos = computed(() => {
  if (isOver.value) return (props.total / displayCurrent.value) * 100;
  return props.total === 0 ? 0 : (displayCurrent.value / props.total) * 100;
});

const isNearEnd = computed(() => movingLabelPos.value > 85);

const movingLabelStyle = computed(() => ({
  left: `${movingLabelPos.value}%`,
  transform: `translateX(-${movingLabelPos.value}%)`,
}));

const fillStyle = computed(() => {
  if (isOver.value) {
    const splitPoint = (props.total / displayCurrent.value) * 100;
    return {
      width: '100%',
      background: isSuccess.value
        ? `linear-gradient(to right, #10b981 ${splitPoint}%, #059669 ${splitPoint}%)`
        : `linear-gradient(to right, #ff4d4d ${splitPoint}%, #cc0000 ${splitPoint}%)`,
    };
  } else {
    const bgColor = isSuccess.value ? '#10b981' : '#3b82f6';
    return {
      width: `${props.total === 0 ? 0 : (displayCurrent.value / props.total) * 100}%`,
      backgroundColor: bgColor,
    };
  }
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  padding: 20px 0 10px 0; /* 💡 높이가 변할 것을 대비해 하단 여백을 살짝 늘렸습니다 */
}

.track {
  width: 100%;
  height: 14px;
  background-color: #e0e0e0;
  border-radius: 20px;
  position: relative;
}

.fill {
  height: 100%;
  border-radius: 20px;
  position: relative;
  transition: width 0.4s ease-out;
}

.indicator-dot {
  width: 18px;
  height: 18px;
  background-color: white;
  /* border-color는 이제 :style에서 동적으로 들어옵니다! */
  border-width: 4px;
  border-style: solid;
  border-radius: 50%;
  position: absolute;
  right: -9px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: border-color 0.3s; /* 색상 변할 때 부드럽게 */
}

.is-danger .indicator-dot,
.is-success .indicator-dot {
  right: 0;
}

.labels-container {
  position: relative;
  width: 100%;
  margin-top: 12px;
}

.label {
  position: absolute;
  font-size: 13px; /* 💡 글자 크기를 살짝 줄여 더 세련되게 바꿨습니다 */
  font-weight: 700;
  color: #444;
  white-space: nowrap;
  transition: all 0.3s ease; /* 💡 위치 변화가 부드럽게 일어나도록 설정 */
}

.moving-label {
  /* transform은 script의 movingLabelStyle에서 동적으로 처리됩니다 */
}

.end-label {
  right: 0;
}

/* 💡 [핵심 스타일] 두 라벨이 가까워지면 목표가(end-label)를 아래로 내립니다 */
.labels-container.is-near-end .end-label {
  transform: translateY(18px); /* 💡 아래로 한 칸 내려서 겹침 방지 */
  font-size: 12px;
  color: #888; /* 살짝 연하게 해서 위계를 줍니다 */
}

/* 텍스트 컬러 */
.text-danger {
  color: #ff4d4d;
}
.text-success {
  color: #10b981;
}
</style>
