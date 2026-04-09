<template>
  <div class="progress-container">
    <div class="track">
      <div class="fill" :class="{ 'is-danger': isOver }" :style="fillStyle">
        <div class="indicator-dot"></div>
      </div>
    </div>

    <div class="labels-container">
      <div class="label moving-label" :style="{ left: movingLabelPos + '%' }">
        {{ isOver ? formatManwon(total) : formatManwon(current) }}만원
      </div>

      <div class="label end-label" :class="{ 'text-danger': isOver }">
        {{ isOver ? formatManwon(current) : formatManwon(total) }}만원
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

// 만원 단위 함수
const formatManwon = (amount) => {
  return Math.floor(amount / 10000);
};

// 초과 여부 확인
const isOver = computed(() => props.current > props.total);
const maxVal = computed(() => Math.max(props.current, props.total));

// 막대 스타일 결정 함수
const fillStyle = computed(() => {
  if (isOver.value) {
    const splitPoint = (props.total / props.current) * 100;
    return {
      width: '100%',
      background: `linear-gradient(to right, #ff4d4d ${splitPoint}%, #cc0000 ${splitPoint}%)`,
    };
  } else {
    return {
      width: `${(props.current / props.total) * 100}%`,
      backgroundColor: '#3b82f6',
    };
  }
});

// 움직이는 라벨(글자)의 위치 계산
const movingLabelPos = computed(() => {
  if (isOver.value) {
    return (props.total / props.current) * 100;
  } else {
    return (props.current / props.total) * 100;
  }
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  padding: 20px 0 40px 0;
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
  transition: width 0.4s ease-out; /* 막대 채워지는 애니메이션 */
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

.is-danger .indicator-dot {
  border-color: #cc0000;
  right: 0;
}

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
  transition: left 0.4s ease-out; /* 글자도 막대와 함께 이동하게 추가' */
}

.end-label {
  right: 0;
}

.text-danger {
  color: #ff4d4d;
}
</style>
