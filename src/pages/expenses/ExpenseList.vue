<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="거래 내역" />
    </template>

    <div class="main-content">
      <ExpenseSearch @search="handleSearch" />

      <section class="recent-section">
        <template v-if="!isEmpty || activeTab !== '전체'">
          <h2 class="section-title">최근 내역</h2>
          <div class="tab-group">
            <button
              v-for="tab in ['전체', '수입', '지출']"
              :key="tab"
              class="tab-btn"
              :class="{ active: activeTab === tab }"
              @click="handleTabChange(tab)"
            >
              {{ tab }}
            </button>
            <span class="fixed-legend">⭐ 고정지출 표시</span>
          </div>
        </template>

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

        <div v-else class="history-list">
          <template v-for="(items, date) in groupedExpenses" :key="date">
            <p class="history-date">{{ date }}</p>
            <div
              v-for="item in items"
              :key="item.id"
              class="history-item"
              @click="goToInfo(item.id)"
            >
              <span class="tag-badge" :style="getTagStyle(item.tag)">
                {{ item.tag?.tagtitle || '기타' }}
              </span>
              <span class="item-name">{{ item.title }}</span>
              <span class="item-pay">
                <span v-if="item.isFixed" class="fixed-star">⭐</span>
                {{ item.paymentMethod }}
              </span>
              <span
                class="item-amount"
                :class="item.type?.typetitle === '수입' ? 'text-success' : ''"
              >
                {{ item.amount.toLocaleString() }}원
              </span>
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
import { useRouter, useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import ExpenseSearch from '@/components/expenses/ExpenseSearch.vue';
import { getExpenses } from '@/api/expenses';
import { getUserInfo } from '@/util/authUtil';

const router = useRouter();
const route = useRoute();
const userInfo = getUserInfo();

const expenses = ref([]);
const activeTab = ref('전체');
const currentUserId = Number(userInfo?.id);

const searchFilters = ref({
  searchText: '',
  startDate: '',
  endDate: '',
  tags: [],
  payment: '',
  minAmount: '',
  maxAmount: '',
});

// 태그 스타일 계산
const getTagStyle = (tag) => {
  if (!tag) return { backgroundColor: '#f0f0f0', color: '#9e9e9e' };
  return {
    backgroundColor: tag.color,
    color: tag.textColor,
  };
};

// API 파라미터 빌드
const buildParams = (filters, tab) => {
  const params = { userId: currentUserId };

  if (filters.searchText) params.title_like = filters.searchText;
  if (filters.startDate) params.date_gte = filters.startDate;
  if (filters.endDate) params.date_lte = filters.endDate;
  if (filters.payment) params.paymentMethod = filters.payment;
  if (filters.minAmount) params.amount_gte = Number(filters.minAmount);
  if (filters.maxAmount) params.amount_lte = Number(filters.maxAmount);
  if (tab !== '전체') params['type.typetitle'] = tab;

  return params;
};

// URL 쿼리 동기화
const updateRouterQuery = () => {
  const query = {};
  const f = searchFilters.value;

  if (f.startDate) query.startDate = f.startDate;
  if (f.endDate) query.endDate = f.endDate;
  if (f.tags?.length > 0) query.tags = f.tags;
  if (activeTab.value !== '전체') query.type = activeTab.value;

  router.push({ query });
};

// 데이터 로드
const fetchExpenses = async (
  filters = searchFilters.value,
  tab = activeTab.value,
) => {
  if (!userInfo || !userInfo.authenticated) {
    alert('로그인이 필요한 서비스입니다.');
    router.push({ name: 'users/login' });
    return;
  }

  try {
    const params = buildParams(filters, tab);
    const res = await getExpenses(params);
    expenses.value = res.data;
  } catch (e) {
    console.error('내역 로드 실패:', e);
  }
};

const handleSearch = (filters) => {
  searchFilters.value = filters;
  updateRouterQuery();
  fetchExpenses(filters, activeTab.value);
};

const handleTabChange = (tabName) => {
  activeTab.value = tabName;
  updateRouterQuery();
  fetchExpenses(searchFilters.value, tabName);
};

const goToInfo = (id) => {
  router.push({ name: 'expenses/info/id', params: { id } });
};

onMounted(() => {
  // 초기 URL 쿼리 반영
  const q = route.query;
  if (q.startDate) searchFilters.value.startDate = q.startDate;
  if (q.endDate) searchFilters.value.endDate = q.endDate;
  if (q.tags)
    searchFilters.value.tags = Array.isArray(q.tags) ? q.tags : [q.tags];
  if (q.type) activeTab.value = q.type;

  fetchExpenses();
});

// 필터링 및 그룹화
const filteredExpenses = computed(() => {
  return expenses.value.filter((e) => {
    if (Number(e.userId) !== currentUserId) return false;

    // 태그 필터링 (JSON 서버에서 처리하기 까다로운 다중 선택 필터)
    if (searchFilters.value.tags.length > 0) {
      const tagId = e.tag?.tagid || e.tag?.id;
      if (!searchFilters.value.tags.includes(String(tagId))) return false;
    }
    return true;
  });
});

const isEmpty = computed(() => filteredExpenses.value.length === 0);

const groupedExpenses = computed(() => {
  const groups = {};
  // 날짜 역순 정렬 후 그룹화
  const sorted = [...filteredExpenses.value].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  sorted.forEach((e) => {
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
  padding-bottom: 80px;
}
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
  align-items: center;
}
.fixed-legend {
  margin-left: auto;
  font-size: 0.65rem;
  color: #7a7a7a;
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
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
}
.item-name {
  flex: 1;
}
.fixed-star {
  font-size: 0.7rem;
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
