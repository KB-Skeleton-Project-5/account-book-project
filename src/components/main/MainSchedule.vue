<template>
  <section class="schedule-section">
    <div class="section-header">
      <h2 class="section-title">📅 오늘 · 내일 일정</h2>
      <span class="more-btn" @click="router.push({ name: 'calendars' })"
        >+ 더보기</span
      >
    </div>

    <div class="schedule-box">
      <div v-if="schedules.length === 0" class="empty-box">
        <span>📭 오늘·내일 일정이 없습니다</span>
      </div>

      <template v-else>
        <!-- 오늘 그룹 -->
        <div v-if="todaySchedules.length > 0">
          <div class="group-header">
            <span class="group-badge today">오늘</span>
            <span class="group-date">{{ todayStr }}</span>
          </div>
          <div v-for="item in todaySchedules" :key="item.id">
            <div class="schedule-item" @click="goToDetail(item.id)">
              <span class="schedule-title">{{ item.title }}</span>
              <span class="schedule-time">{{ item.time }}</span>
            </div>
            <div v-if="item.memo" class="schedule-memo">{{ item.memo }}</div>
          </div>
        </div>

        <!-- 구분선 (오늘+내일 둘 다 있을 때만) -->
        <div
          v-if="todaySchedules.length > 0 && tomorrowSchedules.length > 0"
          class="divider"
        ></div>

        <!-- 내일 그룹 -->
        <div v-if="tomorrowSchedules.length > 0">
          <div class="group-header">
            <span class="group-badge tomorrow">내일</span>
            <span class="group-date">{{ tomorrowStr }}</span>
          </div>
          <div v-for="item in tomorrowSchedules" :key="item.id">
            <div class="schedule-item" @click="goToDetail(item.id)">
              <span class="schedule-title">{{ item.title }}</span>
              <span class="schedule-time">{{ item.time }}</span>
            </div>
            <div v-if="item.memo" class="schedule-memo">{{ item.memo }}</div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil';

const router = useRouter();

const schedules = ref([]);
const todaySchedules = ref([]);
const tomorrowSchedules = ref([]);
const todayStr = ref('');
const tomorrowStr = ref('');

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDisplay = (dateStr) => {
  // "2026-04-12" → "26.04.12"
  return dateStr.slice(2).replace(/-/g, '.');
};

const goToDetail = (id) => {
  router.push({ name: 'calendars/info', params: { id } });
};

onMounted(async () => {
  try {
    const { id } = getUserInfo();
    const res = await axios.get('/api/calendars', { params: { user_id: id } });

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const todayRaw = formatDate(now);
    const tomorrowRaw = formatDate(tomorrow);

    todayStr.value = formatDisplay(todayRaw);
    tomorrowStr.value = formatDisplay(tomorrowRaw);

    const all = res.data
      .filter((e) => e.date === todayRaw || e.date === tomorrowRaw)
      .sort((a, b) => a.time.localeCompare(b.time));

    todaySchedules.value = all.filter((e) => e.date === todayRaw);
    tomorrowSchedules.value = all.filter((e) => e.date === tomorrowRaw);
    schedules.value = all;
  } catch (e) {
    schedules.value = [];
  }
});
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #545045;
}

.more-btn {
  font-size: 0.8rem;
  color: #9e9e9e;
  cursor: pointer;
}

.more-btn:hover {
  color: #545045;
}

.schedule-box {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 4px 14px;
  background: #fff;
}

.empty-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #b0b0b0;
}

.schedule-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  cursor: pointer;
}

.schedule-item:hover .schedule-title {
  color: #7ec8a4;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0 4px;
}

.group-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 99px;
  flex-shrink: 0;
}

.group-badge.today {
  background: #ffcc00;
  color: #545045;
}

.group-badge.tomorrow {
  background: #f0f0f0;
  color: #9e9e9e;
}

.group-date {
  font-size: 0.75rem;
  color: #b0b0b0;
}

.schedule-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #545045;
}

.schedule-time {
  font-size: 0.75rem;
  color: #9e9e9e;
}

.schedule-memo {
  font-size: 0.75rem;
  color: #b0b0b0;
  padding: 0 0 8px 4px;
}

.divider {
  height: 1px;
  background: #f0f0f0;
}
</style>
