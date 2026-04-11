<template>
  <div class="search-wrap">
    <!-- 검색바 -->
    <div class="search-bar">
      <input
        type="text"
        class="search-input"
        placeholder="검색"
        v-model="searchText"
        @keyup.enter="handleSearch"
      />
      <button class="icon-btn" @click="showFilter = !showFilter">⊞</button>
    </div>

    <!-- 필터 -->
    <div v-show="showFilter" class="filter-card">
      <!-- 초기화 버튼 -->
      <div class="filter-top">
        <AppButton type="history" text="초기화" @click="handleReset" />
      </div>

      <!-- 날짜 -->
      <div class="filter-row">
        <span class="filter-label">날짜</span>
        <div class="filter-inputs">
          <input
            type="date"
            class="filter-input"
            v-model="startDate"
            :max="formatDate(today)"
          />
          <input
            type="date"
            class="filter-input"
            v-model="endDate"
            :max="formatDate(today)"
          />
        </div>
      </div>

      <!-- 지출 태그 -->
      <div class="filter-row">
        <span class="filter-label">지출</span>
        <div class="tag-list">
          <button
            v-for="tag in expenseTags"
            :key="tag.tagid"
            class="tag-btn"
            :class="{ active: selectedTags.includes(tag.tagid) }"
            :style="{
              backgroundColor: selectedTags.includes(tag.tagid)
                ? tag.color
                : '#f0f0f0',
              color: selectedTags.includes(tag.tagid)
                ? tag.textColor
                : '#9e9e9e',
            }"
            @click="toggleTag(tag.tagid)"
          >
            {{ tag.tagtitle }}
          </button>
        </div>
      </div>

      <!-- 수입 태그 -->
      <div class="filter-row">
        <span class="filter-label">수입</span>
        <div class="tag-list">
          <button
            v-for="tag in incomeTags"
            :key="tag.tagid"
            class="tag-btn"
            :class="{ active: selectedTags.includes(tag.tagid) }"
            :style="{
              backgroundColor: selectedTags.includes(tag.tagid)
                ? tag.color
                : '#f0f0f0',
              color: selectedTags.includes(tag.tagid)
                ? tag.textColor
                : '#9e9e9e',
            }"
            @click="toggleTag(tag.tagid)"
          >
            {{ tag.tagtitle }}
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
            @click="selectedPayment = selectedPayment === '현금' ? '' : '현금'"
          >
            현금
          </button>
          <button
            class="filter-select"
            :class="{ active: selectedPayment === '카드' }"
            @click="selectedPayment = selectedPayment === '카드' ? '' : '카드'"
          >
            카드
          </button>
        </div>
      </div>

      <!-- 금액 -->
      <div class="filter-row">
        <span class="filter-label">금액</span>
        <div class="amount-inputs">
          <input
            type="number"
            class="filter-input"
            placeholder="최소 금액"
            v-model="minAmount"
          />
          <span class="amount-divider">~</span>
          <input
            type="number"
            class="filter-input"
            placeholder="최대 금액"
            v-model="maxAmount"
          />
        </div>
      </div>

      <button class="search-btn" @click="handleSearch">검색</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AppButton from '@/components/commons/AppButton.vue';
import { getTags } from '@/api/tags';

const emit = defineEmits(['search']);

const searchText = ref('');
const showFilter = ref(false);
const selectedTags = ref([]);
const tags = ref([]);

onMounted(async () => {
  try {
    const res = await getTags();
    tags.value = res.data;
  } catch (e) {
    console.error('태그 불러오기 실패:', e);
  }
});

// 지출 태그만
const expenseTags = computed(() => tags.value.filter((t) => t.type === '지출'));
// 수입 태그만
const incomeTags = computed(() => tags.value.filter((t) => t.type === '수입'));

const selectedPayment = ref('');
const minAmount = ref('');
const maxAmount = ref('');

const today = new Date();
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
const formatDate = (date) => date.toISOString().split('T')[0];
const startDate = ref(formatDate(oneMonthAgo));
const endDate = ref(formatDate(today));

const toggleTag = (id) => {
  const idx = selectedTags.value.indexOf(id);
  if (idx === -1) selectedTags.value.push(id);
  else selectedTags.value.splice(idx, 1);
};

const handleReset = () => {
  searchText.value = '';
  startDate.value = formatDate(oneMonthAgo);
  endDate.value = formatDate(today);
  selectedTags.value = [];
  selectedPayment.value = '';
  minAmount.value = '';
  maxAmount.value = '';
  handleSearch();
};

const handleSearch = () => {
  emit('search', {
    searchText: searchText.value,
    startDate: startDate.value,
    endDate: endDate.value,
    tags: [...selectedTags.value],
    payment: selectedPayment.value,
    minAmount: minAmount.value,
    maxAmount: maxAmount.value,
  });
};
</script>

<style scoped>
.search-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
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
  color: #545045;
}
.search-input::placeholder {
  color: #c0c0c0;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
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
.amount-inputs {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  overflow: hidden;
}
.amount-divider {
  font-size: 0.85rem;
  color: #9e9e9e;
  flex-shrink: 0;
}
.filter-input {
  flex: 1;
  min-width: 0;
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
.filter-top {
  display: flex;
  justify-content: flex-end;
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
</style>
