<template>
  <section class="goal-section">
    <div class="goal-header">
      <h2 class="section-title">🔥 목표 달성까지 !</h2>
      <span class="more-btn" @click="router.push({ name: 'challenges' })"
        >+ 더보기</span
      >
    </div>

    <div v-if="challenges.length === 0" class="empty-box">
      <span>📭 이번달 챌린지가 없습니다</span>
    </div>

    <div
      v-for="item in challenges"
      :key="item.id"
      class="goal-item"
      @click="router.push({ name: 'challenges/info', params: { id: item.id } })"
    >
      <div class="goal-title-row">
        <span class="goal-label">{{ item.title }}</span>
        <span class="goal-percent" :style="badgeStyle(item)">{{
          getPercent(item)
        }}</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: barWidth(item) + '%', background: barColor(item) }"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil';

const router = useRouter();
const challenges = ref([]);

onMounted(async () => {
  try {
    const { id } = getUserInfo();
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1;

    const [challengeRes, expenseRes] = await Promise.all([
      axios.get('/api/challenges', { params: { user_id: id } }),
      axios.get('/api/expenses', { params: { user_id: id } }),
    ]);

    const targetYearMonth = `${thisYear}-${String(thisMonth).padStart(2, '0')}`;

    challenges.value = challengeRes.data
      .filter((c) => c.year === thisYear && c.month === thisMonth)
      .map((c) => {
        const currentAmount = expenseRes.data.reduce((sum, e) => {
          const isSameMonth = e.date && e.date.includes(targetYearMonth);
          const isSameType = e.type?.typetitle === c.type;
          const isSameTag = c.tag === 'all' || e.tag?.tagid === c.tag;
          return isSameMonth && isSameType && isSameTag
            ? sum + Number(e.amount)
            : sum;
        }, 0);
        return { ...c, currentAmount };
      });
  } catch (e) {
    challenges.value = [];
  }
});

const barWidth = (item) => {
  const pct = (item.currentAmount / item.targetAmount) * 100;
  return Math.min(pct, 100);
};

const getPercent = (item) => {
  const pct = Math.floor((item.currentAmount / item.targetAmount) * 100);
  if (item.type === '지출') return pct >= 100 ? '목표 실패!' : `${pct}%`;
  return pct >= 100 ? '목표 달성!' : `${pct}%`;
};

const barColor = (item) => {
  const pct = (item.currentAmount / item.targetAmount) * 100;
  if (item.type === '지출') {
    if (pct < 30) return '#66A882';
    if (pct < 70) return '#FFCC00';
    return '#E57373';
  } else {
    if (pct < 30) return '#E57373';
    if (pct < 70) return '#FFCC00';
    return '#66A882';
  }
};

const badgeStyle = (item) => {
  const result = getPercent(item);
  if (result === '목표 달성!') return { color: '#64B5F6' };
  if (result === '목표 실패!') return { color: '#E57373' };
  const pct = (item.currentAmount / item.targetAmount) * 100;
  if (item.type === '지출') {
    if (pct < 30) return { color: '#66A882' };
    if (pct < 70) return { color: '#B8860B' };
    return { color: '#E57373' };
  } else {
    if (pct < 30) return { color: '#E57373' };
    if (pct < 70) return { color: '#B8860B' };
    return { color: '#66A882' };
  }
};
</script>

<style scoped>
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #545045;
}
.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.more-btn {
  font-size: 0.8rem;
  color: #9e9e9e;
  cursor: pointer;
}
.more-btn:hover {
  color: #545045;
}
.empty-box {
  border: 1px dashed #e0e0e0;
  border-radius: 10px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #b0b0b0;
}
.goal-item {
  margin-bottom: 14px;
  cursor: pointer;
}
.goal-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.goal-label {
  font-size: 0.85rem;
  color: #545045;
  font-weight: 600;
}
.goal-percent {
  font-size: 0.78rem;
  font-weight: 700;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}
</style>
