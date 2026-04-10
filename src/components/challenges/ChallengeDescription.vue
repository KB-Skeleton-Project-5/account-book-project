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

// 💡 [핵심 로직] 각 태그명에 맞춰 실제 이미지 주소를 생성합니다.
const tagIcon = computed(() => {
  const iconMap = {
    교통비: '교통비',
    식비: '식비',
    쇼핑: '쇼핑',
    기타: '기타',
    전체: '전체',
    급여: '급여',
    투자: '투자',
    부업: '부업',
  };

  const fileName = iconMap[props.tag] || '기타';
  return new URL(`../../assets/icons/${fileName}.png`, import.meta.url).href;
});
</script>

<style scoped>
/* 1. 아이콘과 글자를 나란히 예쁘게 배치 */
.description-container {
  display: flex;
  align-items: center;
  gap: 14px; /* 간격을 살짝 더 넓혀 시원하게 */
  margin-top: 24px;
}

/* 2. 이미지를 담는 조약돌 같은 배경 공간 */
.tag-icon-wrapper {
  width: 50px; /* 아이콘 크기에 맞춰 살짝 키움 */
  height: 50px;
  border-radius: 12px;
  background-color: #f8fafc; /* 훨씬 깨끗하고 모던한 연회색 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden; /* 이미지가 원 밖으로 나가지 않게 */
}

/* 3. 💡 실제 이미지 스타일링 */
.tag-icon-image {
  width: 40px; /* 이미지 크기 조절 */
  height: 40px;
  object-fit: contain; /* 찌그러지지 않고 비율 유지 */
}

/* 4. 설명 텍스트 스타일 (고급스러운 슬레이트 그레이 색상) */
.description-text {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600; /* 조금 더 뚜렷하게 */
  color: #475569; /* 눈이 편안한 딥 그레이 */
  line-height: 1.5;
}
</style>
