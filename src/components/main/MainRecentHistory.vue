<template>
  <section class="recent-section">
    <h2 class="section-title">최근 내역</h2>
    <div class="recent-card">
      <!-- 탭 row -->
      <div class="tab-row">
        <!-- 왼쪽: 수입/지출 -->
        <div class="tab-group">
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
        <!-- 오른쪽: 지출 태그 2개 + 수입 태그 2개 -->
        <div class="tab-group">
          <button
            v-for="tag in filteredTags"
            :key="tag.id"
            class="tab-btn"
            :class="{ active: activeTag === tag.tagid }"
            @click="activeTag = tag.tagid"
          >
            {{ tag.tagtitle }}
          </button>
        </div>
      </div>

      <!-- 두 리스트 나란히 -->
      <div class="history-columns">
        <!-- 왼쪽: 수입/지출 내역 -->
        <div class="history-list">
          <template v-if="leftList.length > 0">
            <template v-for="(group, date) in leftGrouped" :key="date">
              <p class="history-date">{{ date }}</p>
              <div
                v-for="item in group"
                :key="item.id"
                class="history-item"
                @click="
                  router.push({
                    name: 'expenses/info/id',
                    params: { id: item.id },
                  })
                "
              >
                <span class="item-title">{{ item.title }}</span>
                <span
                  class="item-amount"
                  :class="item.type.typetitle === '수입' ? 'income' : 'expense'"
                >
                  {{ item.amount.toLocaleString() }}원
                </span>
              </div>
            </template>
          </template>
          <div v-else class="empty-text">내역이 없습니다</div>
        </div>

        <!-- 구분선 -->
        <div class="divider"></div>

        <!-- 오른쪽: 태그별 내역 -->
        <div class="history-list">
          <template v-if="rightList.length > 0">
            <template v-for="(group, date) in rightGrouped" :key="date">
              <p class="history-date">{{ date }}</p>
              <div
                v-for="item in group"
                :key="item.id"
                class="history-item"
                @click="
                  router.push({
                    name: 'expenses/info/id',
                    params: { id: item.id },
                  })
                "
              >
                <span class="item-title">{{ item.title }}</span>
                <span
                  class="item-amount"
                  :class="item.type.typetitle === '수입' ? 'income' : 'expense'"
                >
                  {{ item.amount.toLocaleString() }}원
                </span>
              </div>
            </template>
          </template>
          <div v-else class="empty-text">내역이 없습니다</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getUserInfo } from '@/util/authUtil';
import { getTags } from '@/api/tags';

const router = useRouter();
const activeTab = ref('수입');
const activeTag = ref('');
const expenses = ref([]);
const tags = ref([]);

onMounted(async () => {
  try {
    const { id } = getUserInfo();
    const [expenseRes, tagRes] = await Promise.all([
      axios.get('/api/expenses', { params: { user_id: id } }),
      getTags(),
    ]);

    expenses.value = expenseRes.data.sort((a, b) =>
      b.date.localeCompare(a.date),
    );

    // id 순 전체 정렬해서 저장
    tags.value = tagRes.data.sort((a, b) => Number(a.id) - Number(b.id));

    // 기본 수입 탭 기준 첫번째 태그
    const firstTag = tags.value.filter((t) => t.type === '수입')[0];
    if (firstTag) activeTag.value = firstTag.tagid;
  } catch (e) {
    expenses.value = [];
    tags.value = [];
  }
});

// 오른쪽 태그 목록 - activeTab에 따라 해당 type 태그 id 순 2개
const filteredTags = computed(() => {
  const type = activeTab.value; // '수입' or '지출'
  return tags.value.filter((t) => t.type === type).slice(0, 2);
});

// activeTab 바뀌면 태그도 첫번째로 초기화
watch(activeTab, () => {
  const first = filteredTags.value[0];
  if (first) activeTag.value = first.tagid;
});
const leftList = computed(() =>
  expenses.value
    .filter((e) => e.type.typetitle === activeTab.value)
    .slice(0, 5),
);

// 오른쪽: 태그별 최근 5개
const rightList = computed(() =>
  expenses.value.filter((e) => e.tag?.tagid === activeTag.value).slice(0, 5),
);

const groupByDate = (list) => {
  return list.reduce((acc, item) => {
    const d = item.date.slice(2).replace(/-/g, '.');
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});
};

const leftGrouped = computed(() => groupByDate(leftList.value));
const rightGrouped = computed(() => groupByDate(rightList.value));
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
  gap: 6px;
}
.tab-group {
  display: flex;
  gap: 6px;
}
.tab-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.78rem;
  color: #9e9e9e;
  cursor: pointer;
  white-space: nowrap;
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
  font-size: 0.72rem;
  color: #9e9e9e;
  margin: 8px 0 4px;
}
.history-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #545045;
  padding: 3px 0;
  cursor: pointer;
  gap: 4px;
}
.history-item:hover .item-title {
  color: #c9a84c;
}
.item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 55%;
}
.item-amount {
  flex-shrink: 0;
  font-weight: 600;
}
.income {
  color: #5b9bd5;
}
.expense {
  color: #e57373;
}
.empty-text {
  font-size: 0.78rem;
  color: #b0b0b0;
  text-align: center;
  padding: 20px 0;
}
</style>
