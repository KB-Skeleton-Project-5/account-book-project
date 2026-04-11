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
              @click="onTabChange('전체')"
            >
              전체
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === '수입' }"
              @click="onTabChange('수입')"
            >
              수입
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === '지출' }"
              @click="onTabChange('지출')"
            >
              지출
            </button>
            <span class="fixed-legend">⭐ 고정지출 표시</span>
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
              <span class="item-pay">
                <span v-if="item.isFixed" class="fixed-star">⭐</span
                >{{ item.paymentMethod }}
              </span>
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
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import ExpenseSearch from '@/components/expenses/ExpenseSearch.vue';
import { getExpenses } from '@/api/expenses';
import { getUserInfo } from '@/util/authUtil';

const expenses = ref([]);
const activeTab = ref('전체');
// 로그인한 유저 id — DB가 숫자로 저장하므로 Number로 통일
const currentUserId = Number(getUserInfo().id);

// 현재 적용된 검색 필터 (마지막으로 검색한 값 보관)
const lastFilters = ref({
  searchText: '',
  startDate: '',
  endDate: '',
  tags: [],
  payment: '',
  minAmount: '',
  maxAmount: '',
});

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

/**
 * 서버로 보낼 쿼리 파라미터 조립
 * json-server 지원 쿼리:
 *   userId        → 로그인 유저 필터 (필수)
 *   title_like    → 키워드 검색 (부분 일치)
 *   date_gte      → 시작 날짜 이상
 *   date_lte      → 종료 날짜 이하
 *   paymentMethod → 결제 수단
 *   amount_gte    → 최소 금액
 *   amount_lte    → 최대 금액
 *   type.typetitle → 수입/지출 탭 (탭 변경 시 사용)
 * 태그는 json-server가 OR 다중값을 지원하지 않으므로 응답 후 프론트에서 보조 필터
 */
const buildParams = (filters, tab) => {
  const params = {};

  // 로그인 유저 데이터만 요청 (필수) —0 숫자 타입으로 통일
  if (currentUserId) params.userId = Number(currentUserId);

  // 키워드 검색
  if (filters.searchText) params.title_like = filters.searchText;

  // 날짜 범위
  if (filters.startDate) params.date_gte = filters.startDate;
  if (filters.endDate) params.date_lte = filters.endDate;

  // 결제 수단
  if (filters.payment) params.paymentMethod = filters.payment;

  // 금액 범위
  if (filters.minAmount) params.amount_gte = Number(filters.minAmount);
  if (filters.maxAmount) params.amount_lte = Number(filters.maxAmount);

  // 수입/지출 탭 (전체면 파라미터 생략)
  if (tab !== '전체') params['type.typetitle'] = tab;

  return params;
};

const fetchExpenses = async (
  filters = lastFilters.value,
  tab = activeTab.value,
) => {
  try {
    const params = buildParams(filters, tab);
    const res = await getExpenses(params);
    expenses.value = res.data;
  } catch (e) {
    console.error('expenses 불러오기 실패:', e);
  }
};

// 검색 컴포넌트에서 emit 받으면 파라미터로 서버 요청
const handleSearch = (filters) => {
  lastFilters.value = filters;
  fetchExpenses(filters, activeTab.value);
};

// 탭 변경 시에도 서버 재요청
const onTabChange = (tab) => {
  activeTab.value = tab;
  fetchExpenses(lastFilters.value, tab);
};

onMounted(() => {
  fetchExpenses();
});

// 보조 필터:
// 1) userId 없는 데이터(불완전한 레코드) 제거 — 서버 파라미터만으로 완벽히 못 잡는 경우 대비
// 2) 태그 다중 선택 — json-server OR 미지원으로 프론트에서 처리
const filteredExpenses = computed(() => {
  return expenses.value.filter((e) => {
    if (Number(e.userId) !== currentUserId) return false;
    if (
      lastFilters.value.tags.length > 0 &&
      !lastFilters.value.tags.includes(e.tag?.tagid)
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
