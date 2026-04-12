<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="Karat Book" />
    </template>

    <div class="main-content">
      <!-- 인사말 -->
      <div style="margin-bottom: 6px">
        <section class="greeting-section">
          <p class="greeting-text">
            <span>👤</span>
            <span class="bold">{{ nick }}</span> 님, 이번달 지출 내역은
            <span class="amount">{{ thisMonthTotal.toLocaleString() }}</span
            >원 입니다.
          </p>
        </section>
      </div>

      <!-- 이번달 / 저번달 집계 카드 (클릭 시 월별 요약으로 이동) -->
      <div
        style="margin-bottom: 20px; cursor: pointer"
        @click="router.push({ name: 'summaries' })"
      >
        <MainSummaryCards />
      </div>

      <!-- 최근 내역 -->
      <div style="margin-bottom: 20px">
        <MainRecentHistory />
      </div>

      <!-- 주간 일정 -->
      <div style="margin-bottom: 20px">
        <MainSchedule />
      </div>

      <!-- 목표 달성까지 -->
      <div style="margin-bottom: 20px">
        <MainGoals />
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import MainSummaryCards from '@/components/main/MainSummaryCards.vue';
import MainRecentHistory from '@/components/main/MainRecentHistory.vue';
import MainSchedule from '@/components/main/MainSchedule.vue';
import MainGoals from '@/components/main/MainGoals.vue';
import { getUserInfo, fetchUserById } from '@/util/authUtil';
import { getExpenses } from '@/api/expenses';

const router = useRouter();

const nick = ref('');
const thisMonthTotal = ref(0);

onMounted(async () => {
  // 1. 로그인 유저 정보 가져오기
  const userInfo = getUserInfo();
  if (!userInfo.authenticated) return;

  // 2. nick 가져오기
  const user = await fetchUserById(userInfo.id);
  if (user) nick.value = user.nick;

  // 3. 이번달 지출 합계 계산
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;

  const res = await getExpenses({ user_id: userInfo.id });
  const expenses = res.data;

  thisMonthTotal.value = expenses
    .filter((e) => {
      const [year, month] = e.date.split('-').map(Number);
      return (
        year === thisYear &&
        month === thisMonth &&
        e.type.typeid === 'withdrawal'
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);
});
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  padding: 16px;
}
.greeting-section {
  padding: 2px 0;
  margin-bottom: 6px;
}
.section-analysis {
  margin-bottom: 6px;
}
.section-gap {
  margin-bottom: 20px;
}
.greeting-text {
  font-size: 1.05rem;
  color: #545045;
  display: flex;
  align-items: center;
  gap: 6px;
}
.amount {
  font-weight: 700;
}
.bold {
  font-weight: 700;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  opacity: 0.85;
  transition: opacity 0.2s ease;
}
</style>
