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
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  type: { type: String, default: '지출' },
});

const displayCurrent = ref(0);

const triggerAnimation = (targetValue) => {
  setTimeout(() => {
    displayCurrent.value = targetValue;
  }, 50);
};

onMounted(() => {
  triggerAnimation(props.current);
});

watch(
  () => props.current,
  (newValue) => {
    triggerAnimation(newValue);
  },
);

const formatManwon = (amount) => Math.floor(amount / 10000);

const isOver = computed(() => displayCurrent.value > props.total);
const isSuccess = computed(
  () => props.type === '수입' && displayCurrent.value >= props.total,
);
const isDanger = computed(
  () => props.type === '지출' && displayCurrent.value >= props.total,
);

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
  }

  let bgColor = '#3b82f6';
  if (isSuccess.value) bgColor = '#10b981';
  if (isDanger.value) bgColor = '#ff4d4d';

  return {
    width: `${props.total === 0 ? 0 : (displayCurrent.value / props.total) * 100}%`,
    backgroundColor: bgColor,
  };
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  padding: 20px 0 10px 0;
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
  transition:
    width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.8s ease;
}

.indicator-dot {
  width: 18px;
  height: 18px;
  background-color: white;
  border-width: 4px;
  border-style: solid;
  border-radius: 50%;
  position: absolute;
  right: -9px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: border-color 0.3s;
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
  font-size: 13px;
  font-weight: 700;
  color: #444;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.end-label {
  right: 0;
}

.labels-container.is-near-end .end-label {
  transform: translateY(18px);
  font-size: 12px;
  color: #888;
}

.text-danger {
  color: #ff4d4d;
}
.text-success {
  color: #10b981;
}
</style>
