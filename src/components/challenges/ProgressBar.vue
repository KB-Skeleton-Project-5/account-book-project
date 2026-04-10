<template>
  <div class="progress-container" :class="statusClass">
    <div class="track">
      <div class="fill" :style="fillStyle">
        <div class="indicator-dot"></div>
      </div>
    </div>

    <div class="labels-container">
      <div
        class="label moving-label"
        :style="{ left: movingLabelPos + '%' }"
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
import { computed } from 'vue';

const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  type: { type: String, default: '지출' }, // 💡 부모가 넘겨준 type을 받습니다!
});

// 만원 단위 함수
const formatManwon = (amount) => {
  return Math.floor(amount / 10000);
};

// 💡 3가지 상태 스위치 계산기
const isOver = computed(() => props.current > props.total);
const isSuccess = computed(
  () => props.type === '수입' && props.current >= props.total,
);
const isDanger = computed(() => props.type === '지출' && isOver.value);

// 상태 클래스 결정 (CSS에서 활용)
const statusClass = computed(() => {
  if (isSuccess.value) return 'is-success';
  if (isDanger.value) return 'is-danger';
  return 'is-normal';
});

// 막대 스타일(길이, 그라데이션) 결정 함수
const fillStyle = computed(() => {
  if (isOver.value) {
    const splitPoint = (props.total / props.current) * 100;
    return {
      width: '100%',
      background: isSuccess.value
        ? `linear-gradient(to right, #10b981 ${splitPoint}%, #059669 ${splitPoint}%)`
        : `linear-gradient(to right, #ff4d4d ${splitPoint}%, #cc0000 ${splitPoint}%)`,
    };
  } else {
    const bgColor = isSuccess.value ? '#10b981' : '#3b82f6';
    const finalWidth =
      props.total === 0 ? 0 : (props.current / props.total) * 100;
    return {
      width: `${finalWidth}%`,
      backgroundColor: bgColor,
    };
  }
});

// 움직이는 라벨 위치 계산
const movingLabelPos = computed(() => {
  if (isOver.value) {
    return (props.total / props.current) * 100;
  } else {
    return props.total === 0 ? 0 : (props.current / props.total) * 100;
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
  transition: width 0.4s ease-out; /* 막대 애니메이션 */
}

/* 동그라미 인디케이터 */
.indicator-dot {
  width: 18px;
  height: 18px;
  background-color: white;
  border: 4px solid #3b82f6; /* 기본 파란색 테두리 */
  border-radius: 50%;
  position: absolute;
  right: -9px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: border-color 0.3s;
}

/* 초과 상태일 때 동그라미 위치 고정 및 색상 변경 */
.is-danger .indicator-dot {
  border-color: #cc0000;
  right: 0;
}
.is-success .indicator-dot {
  border-color: #059669;
  /* 수입 달성/초과 시 오른쪽 끝에 고정 */
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
  transition: color 0.3s;
}

.moving-label {
  transform: translateX(-50%);
  transition: left 0.4s ease-out;
}

.end-label {
  right: 0;
}

/* 텍스트 컬러 지정 */
.text-danger {
  color: #ff4d4d;
}
.text-success {
  color: #10b981;
}

.moving-label.zero-align {
  /* 기존의 translateX(-50%)를 0%로 덮어씌워서, 글자의 시작점을 0% 선에 딱 맞춥니다! */
  transform: translateX(0%);
}
</style>
