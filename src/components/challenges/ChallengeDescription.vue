<template>
  <div class="description-container">
    <div class="tag-icon-wrapper">
      <img :src="tagIcon" :alt="props.tag" class="tag-icon-image" />
    </div>

    <h5 class="description-text">
      {{ tag }}에서 {{ targetAmount }}만원
      {{ type === '지출' ? '이하 지출' : '이상 수입' }}
    </h5>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  tag: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  type: { type: String, default: '지출' },
});

const tagIcon = computed(() => {
  const iconMap = {
    식비: '식비',
    교통: '교통',
    쇼핑: '쇼핑',
    의료: '의료',
    급여: '급여',
    금융: '금융',
    부수입: '부수입',
    전체: '전체',
  };

  const fileName = iconMap[props.tag] || '전체';
  return new URL(`../../assets/icons/${fileName}.png`, import.meta.url).href;
});
</script>

<style scoped>
.description-container {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
}

.tag-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

.tag-icon-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.description-text {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
  line-height: 1.5;
}
</style>
