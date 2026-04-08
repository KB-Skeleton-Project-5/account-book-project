<template>
  <div class="progress-wrapper">
    <div class="track">
      <div
        class="fill"
        :class="{ 'is-danger': isOver }"
        :style="{ width: percent + '%' }"
      >
        <span class="indicator-dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  current: { type: Number, default: 0 }, // 현재 지출액
  total: { type: Number, default: 1 }, // 목표 금액
});

// 진행률 계산
const percent = computed(() => {
  const result = (props.current / props.total) * 100;
  return result > 100 ? 100 : result; // 100%가 넘어도 바가 뚫고 나가지 않게 함
});

// 목표 달성 여부 (100%를 넘으면 빨간색으로 바꿀 때 사용)
const isOver = computed(() => (props.current / props.total) * 100 > 100);
</script>

<style scoped>
.progress-wrapper {
  width: 100%;
  padding: 10px 0;
}

.track {
  width: 100%;
  height: 12px;
  background-color: #e0e0e0; /* 연한 회색 */
  border-radius: 10px;
  position: relative;
}

.fill {
  height: 100%;
  background-color: #3b82f6; /* 기본 파란색 */
  border-radius: 10px;
  position: relative;
  transition: width 0.4s ease-out; /* 데이터 변경 시 부드럽게 차오름 */
}

/* 목표 초과 시 빨간색 */
.fill.is-danger {
  background-color: #ff4d4d;
}

.indicator-dot {
  width: 16px;
  height: 16px;
  background-color: white;
  border: 4px solid inherit; /* 부모(fill)의 색상을 따라가도록 나중에 JS나 CSS 변수 처리 가능 */
  border-color: #3b82f6;
  border-radius: 50%;
  position: absolute;
  right: -8px; /* 점의 중심이 막대 끝에 오도록 */
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.is-danger .indicator-dot {
  border-color: #ff4d4d;
}
</style>
