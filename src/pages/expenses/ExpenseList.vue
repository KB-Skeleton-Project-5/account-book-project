<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="거래 내역" />
    </template>

    <div class="main-content">
      <!-- 검색 컴포넌트 -->
      <ExpenseSearch @search="handleSearch" />

      <!-- 최근 내역 -->
      <section class="recent-section">
        <template v-if="!isEmpty || activeTab !== '전체'">
          <h2 class="section-title">최근 내역</h2>
          <div class="tab-group">
            <button
              class="tab-btn"
              :class="{ active: activeTab === '전체' }"
              @click="activeTab = '전체'"
            >
              전체
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === '수입' }"
              @click="activeTab = '수입'"
            >
              수입
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === '지출' }"
              @click="activeTab = '지출'"
            >
              지출
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
          <template v-for="(items, date) in groupedExpenses" :key="date">
            <p class="history-date">{{ date }}</p>
            <div
              v-for="item in items"
              :key="item.id"
              class="history-item"
              @click="
                $router.push({
                  name: 'expenses/info/id',
                  params: { id: item.id },
                })
              "
            >
              <span class="tag-badge" :style="getTagStyle(item.tag.tagid)">{{
                item.tag.tagtitle
              }}</span>
              <span class="item-name">{{ item.title }}</span>
              <span class="item-pay">{{ item.paymentMethod }}</span>
              <span class="item-amount"
                >{{ item.amount.toLocaleString() }}원</span
              >
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import ExpenseSearch from '@/components/expenses/ExpenseSearch.vue';

const expenses = ref([]);
const activeTab = ref('전체');

const tagColorMap = {
  eat: { background: '#FFD6D6', color: '#E57373' },
  traffic: { background: '#D6EAFF', color: '#5B9BD5' },
  shopping: { background: '#D6F0E0', color: '#66A882' },
  etc: { background: '#FFF3C4', color: '#B8860B' },
};

const getTagStyle = (tagid) => ({
  backgroundColor: tagColorMap[tagid]?.background || '#f0f0f0',
  color: tagColorMap[tagid]?.color || '#9e9e9e',
});

// 검색 필터
const searchFilters = ref({
  searchText: '',
  startDate: '',
  endDate: '',
  tags: [],
  payment: '',
  minAmount: '',
  maxAmount: '',
});

const handleSearch = (filters) => {
  searchFilters.value = filters;
};

// 데이터 불러오기
const fetchExpenses = async () => {
  try {
    const res = await axios.get('http://localhost:3000/expenses');
    expenses.value = res.data;
  } catch (e) {
    console.error('expenses 불러오기 실패:', e);
  }
};

onMounted(() => {
  fetchExpenses();
});

// 필터링
const filteredExpenses = computed(() => {
  return expenses.value.filter((e) => {
    if (activeTab.value !== '전체' && e.type.typetitle !== activeTab.value)
      return false;
    if (
      searchFilters.value.searchText &&
      !e.title.includes(searchFilters.value.searchText)
    )
      return false;
    if (searchFilters.value.startDate && e.date < searchFilters.value.startDate)
      return false;
    if (searchFilters.value.endDate && e.date > searchFilters.value.endDate)
      return false;
    if (
      searchFilters.value.tags.length > 0 &&
      !searchFilters.value.tags.includes(e.tag.tagid)
    )
      return false;
    if (
      searchFilters.value.payment &&
      e.paymentMethod !== searchFilters.value.payment
    )
      return false;
    if (
      searchFilters.value.minAmount &&
      e.amount < Number(searchFilters.value.minAmount)
    )
      return false;
    if (
      searchFilters.value.maxAmount &&
      e.amount > Number(searchFilters.value.maxAmount)
    )
      return false;
    return true;
  });
});

const isEmpty = computed(() => filteredExpenses.value.length === 0);

const groupedExpenses = computed(() => {
  const groups = {};
  filteredExpenses.value.forEach((e) => {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  });
  return groups;
});
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
  cursor: pointer;
}
.history-item:hover {
  background-color: #f9f9f9;
  border-radius: 6px;
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
