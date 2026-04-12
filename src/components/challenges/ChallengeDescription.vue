<template>
  <div class="description-container">
    <div class="tag-icon-wrapper">
      <img :src="tagIcon" :alt="translatedTitle" class="tag-icon-image" />
    </div>

    <h5 class="description-text">
      {{ translatedTitle }}에서 {{ targetAmount }}만원
      {{ type === '지출' ? '이하 지출' : '이상 수입' }}
    </h5>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getTagTitle, getTagIconUrl } from '@/util/tagUtil.js';

const props = defineProps({
  tag: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  type: { type: String, default: '지출' },
});

const translatedTitle = computed(() => getTagTitle(props.tag));
const tagIcon = computed(() => getTagIconUrl(props.tag));
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
