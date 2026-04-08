<template>
  <section class="recent-section">
    <h2 class="section-title">최근 내역</h2>
    <div class="recent-card">
      <!-- 탭 row -->
      <div class="tab-row">
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
        <div class="tab-group">
          <button
            class="tab-btn"
            :class="{ active: activeCategory === '식비' }"
            @click="activeCategory = '식비'"
          >
            식비
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeCategory === '의료' }"
            @click="activeCategory = '의료'"
          >
            의료
          </button>
        </div>
      </div>

      <!-- 두 리스트 나란히 -->
      <div class="history-columns">
        <!-- 왼쪽: 입금/출금 -->
        <div class="history-list">
          <p class="history-date">26.00.00</p>
          <div class="history-item">
            <span>급여일</span><span>00000원</span>
          </div>
          <div class="history-item">
            <span>점심식사</span><span>00000원</span>
          </div>
          <div class="history-item">
            <span>저녁식사</span><span>00000원</span>
          </div>
          <p class="history-date">26.00.00</p>
          <div class="history-item">
            <span>급여일</span><span>00000원</span>
          </div>
          <div class="history-item">
            <span>점심식사</span><span>00000원</span>
          </div>
        </div>

        <!-- 구분선 -->
        <div class="divider"></div>

        <!-- 오른쪽: 카테고리 -->
        <div class="history-list">
          <p class="history-date">26.00.00</p>
          <div class="history-item">
            <span>점심식사</span><span>00000원</span>
          </div>
          <div class="history-item">
            <span>저녁식사</span><span>00000원</span>
          </div>
          <p class="history-date">26.00.00</p>
          <div class="history-item">
            <span>점심식사</span><span>00000원</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('입금');
const activeCategory = ref('식비');
</script>

<style scoped>
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #545045;
  margin-bottom: 8px;
}
.recent-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px;
}
.tab-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.tab-group {
  display: flex;
  gap: 6px;
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

.history-columns {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 8px;
}
.divider {
  background: #e0e0e0;
  width: 1px;
}
.history-date {
  font-size: 0.75rem;
  color: #9e9e9e;
  margin: 8px 0 4px;
}
.history-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #545045;
  padding: 3px 0;
}
</style>
