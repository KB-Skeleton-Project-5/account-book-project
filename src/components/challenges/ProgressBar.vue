<template>
  <div class="progress-container">
    <div class="track">
      <div class="fill" :class="{ 'is-danger': isOver }" :style="fillStyle">
        <div class="indicator-dot"></div>
      </div>
    </div>

    <div class="labels-container">
      <div
        class="label moving-label"
        :class="{ 'text-danger': isOver }"
        :style="{ left: movingLabelPos + '%' }"
      >
        {{ isOver ? total : current }}만원
      </div>

      <div class="label end-label" :class="{ 'text-danger': isOver }">
        {{ isOver ? current : total }}만원
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
});

// 목표 초과 여부
const isOver = computed(() => props.current > props.total);

// 바의 전체 기준값 (초과 시 현재액이 기준, 미만 시 목표액이 기준)
const maxVal = computed(() => Math.max(props.current, props.total));

// 바의 채워지는 스타일
const fillStyle = computed(() => {
  if (isOver.value) {
    // 초과 시: 전체가 빨간색이지만 목표지점(total)까지만 밝은 빨강, 그 이후는 진한 빨강으로 구분
    const splitPoint = (props.total / props.current) * 100;
    return {
      width: '100%',
      background: `linear-gradient(to right, #ff4d4d ${splitPoint}%, #cc0000 ${splitPoint}%)`,
    };
  } else {
    // 정상 시: 현재 지출액만큼만 파란색으로 채움
    return {
      width: `${(props.current / props.total) * 100}%`,
      backgroundColor: '#3b82f6',
    };
  }
});

// 움직이는 라벨의 위치 (%)
const movingLabelPos = computed(() => {
  if (isOver.value) {
    // 초과 시: 목표액(total)이 왼쪽 어딘가에 위치
    return (props.total / props.current) * 100;
  } else {
    // 정상 시: 현재액(current)이 점과 함께 움직임
    return (props.current / props.total) * 100;
  }
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  padding: 20px 0 40px 0; /* 라벨 공간 확보 */
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
  border: 4px solid #3b82f6;
  border-radius: 50%;
  position: absolute;
  right: -9px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

/* 초과 시 점 스타일 변경 */
.is-danger .indicator-dot {
  border-color: #cc0000;
  right: 0; /* 초과 시엔 항상 맨 끝에 붙음 */
}

/* 라벨 스타일 */
.labels-container {
  position: relative;
  width: 100%;
  margin-top: 8px;
}

.label {
  position: absolute;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.moving-label {
  transform: translateX(-50%);
}

.end-label {
  right: 0;
}

.text-danger {
  color: #ff4d4d;
}
</style>
