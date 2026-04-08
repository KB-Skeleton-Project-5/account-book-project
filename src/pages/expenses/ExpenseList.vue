<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="지출 내역" />
    </template>

    <div class="main-content">
      <!-- 검색바 -->
      <div class="search-bar">
        <input type="text" class="search-input" placeholder="검색" />
        <div class="search-icons">
          <button class="icon-btn">🔍</button>
          <button class="icon-btn" @click="showFilter = !showFilter">⊞</button>
        </div>
      </div>

      <!-- 필터 -->
      <div v-show="showFilter" class="filter-card">
        <!-- 날짜 -->
        <div class="filter-row">
          <span class="filter-label">날짜</span>
          <div class="filter-inputs">
            <input type="date" class="filter-input" v-model="startDate" />
            <input type="date" class="filter-input" v-model="endDate" />
          </div>
        </div>

        <!-- 태그 -->
        <div class="filter-row">
          <span class="filter-label">태그</span>
          <div class="tag-list">
            <button
              v-for="tag in tags"
              :key="tag"
              class="tag-btn"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- 결제 -->
        <div class="filter-row">
          <span class="filter-label">결제</span>
          <div class="filter-inputs">
            <button
              class="filter-select"
              :class="{ active: selectedPayment === '현금' }"
              @click="selectedPayment = '현금'"
            >
              현금
            </button>
            <button
              class="filter-select"
              :class="{ active: selectedPayment === '카드' }"
              @click="selectedPayment = '카드'"
            >
              카드
            </button>
          </div>
        </div>

        <!-- 금액 -->
        <div class="filter-row">
          <span class="filter-label">금액</span>
          <div class="filter-inputs">
            <input type="number" class="filter-input" placeholder="원" />
            <input type="number" class="filter-input" placeholder="원" />
          </div>
        </div>

        <button class="search-btn">검색</button>
      </div>

      <!-- 최근 내역 -->
      <section class="recent-section">
        <template v-if="!isEmpty">
          <h2 class="section-title">최근 내역</h2>
          <div class="tab-group">
            <button
              class="tab-btn"
              :class="{ active: activeTab === '입금' }"
              @click="activeTab = '입금'"
            >
              입금
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === '출금' }"
              @click="activeTab = '출금'"
            >
              출금
            </button>
          </div>
        </template>

        <!-- 데이터 없을 때 -->
        <div v-if="isEmpty" class="empty-state">
          <div class="empty-icon">!</div>
          <p class="empty-text">등록된 내역이 없습니다</p>
          <button
            class="empty-btn"
            @click="$router.push({ name: 'expenses/add' })"
          >
            내역 등록
          </button>
        </div>

        <!-- 데이터 있을 때 -->
        <div v-else class="history-list">
          <template v-for="n in 5" :key="n">
            <p class="history-date">26.00.00</p>
            <div class="history-item">
              <span class="tag-badge">태그</span>
              <span class="item-name">급여일</span>
              <span class="item-pay">카드</span>
              <span class="item-amount">00000원</span>
            </div>
            <div class="history-item">
              <span class="tag-badge">태그</span>
              <span class="item-name">점심식사</span>
              <span class="item-pay">카드</span>
              <span class="item-amount">00000원</span>
            </div>
            <div class="history-item">
              <span class="tag-badge">태그</span>
              <span class="item-name">저녁식사</span>
              <span class="item-pay">카드</span>
              <span class="item-amount">00000원</span>
            </div>
          </template>
        </div>
      </section>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

// TODO: API 연결 시 실제 데이터 유무로 변경 (data.length === 0)
const isEmpty = ref(false); // true: 빈 화면, false: 목록 표시
const selectedPayment = ref('');
const selectedTags = ref([]);
const tags = ['식비', '식비', '식비', '식비', '식비', '식비'];
const showFilter = ref(false);

// 오늘 날짜 기준 한 달 전 ~ 오늘
const today = new Date();
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const formatDate = (date) => date.toISOString().split('T')[0];

const startDate = ref(formatDate(oneMonthAgo));
const endDate = ref(formatDate(today));

const toggleTag = (tag) => {
  const idx = selectedTags.value.indexOf(tag);
  if (idx === -1) selectedTags.value.push(tag);
  else selectedTags.value.splice(idx, 1);
};
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

/* 검색바 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 6px 12px;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
}
.search-icons {
  display: flex;
  gap: 4px;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

/* 필터 카드 */
.filter-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #545045;
  width: 36px;
  flex-shrink: 0;
  padding-top: 4px;
}
.filter-inputs {
  display: flex;
  gap: 8px;
  flex: 1;
}
.filter-input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 0.8rem;
  outline: none;
}
.filter-select {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 0.8rem;
  background: #fff;
  cursor: pointer;
}
.filter-select.active {
  background: #ffcc00;
  border-color: #ffcc00;
  font-weight: 600;
}

/* 태그 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}
.tag-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: #9e9e9e;
  cursor: pointer;
}
.tag-btn.active {
  background: #ffcc00;
  color: #545045;
  font-weight: 600;
}

.search-btn {
  background: #ffcc00;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #545045;
  cursor: pointer;
  width: 100%;
}

/* 최근 내역 */
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #545045;
  margin-bottom: 8px;
}
.tab-group {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}
.tab-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 0.8rem;
  color: #9e9e9e;
  cursor: pointer;
}
.tab-btn.active {
  background: #ffcc00;
  color: #545045;
  font-weight: 600;
}
.history-date {
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 8px 0 4px;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #545045;
  padding: 4px 0;
}
.tag-badge {
  background: #f0f0f0;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  color: #9e9e9e;
}
.item-name {
  flex: 1;
}
.item-pay {
  font-size: 0.75rem;
  color: #9e9e9e;
}
.item-amount {
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
}
.empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e57373;
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-text {
  font-size: 0.95rem;
  color: #545045;
  font-weight: 500;
}
.empty-btn {
  background: #ffcc00;
  border: none;
  border-radius: 8px;
  padding: 6px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #545045;
  cursor: pointer;
}
</style>
