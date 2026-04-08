<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="가계부 HOME" />
    </template>

    <div class="main-content">
      <!-- 인사말 -->
      <section class="greeting-section">
        <p class="greeting-text">
          <span>👤</span>
          OOO 님, 이번달 지출 내역은 <span class="amount">______</span>원
          입니다.
        </p>
      </section>

      <!-- 이번달 / 저번달 집계 카드 -->
      <MainSummaryCards />

      <!-- 최근 내역 -->
      <MainRecentHistory />

      <!-- 주간 일정 -->
      <MainSchedule />

      <!-- 목표 달성까지 -->
      <MainGoals />
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import MainSummaryCards from '@/components/main/MainSummaryCards.vue';
import MainRecentHistory from '@/components/main/MainRecentHistory.vue';
import MainSchedule from '@/components/main/MainSchedule.vue';
import MainGoals from '@/components/main/MainGoals.vue';
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
.greeting-section {
  padding: 8px 0;
}
.greeting-text {
  font-size: 0.9rem;
  color: #545045;
  display: flex;
  align-items: center;
  gap: 6px;
}
.amount {
  font-weight: 700;
}
</style>
