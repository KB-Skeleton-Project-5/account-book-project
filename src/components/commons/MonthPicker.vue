<template>
  <div class="month-picker">
    <div class="dropdown">
      <button
        class="btn dropdown-toggle picker-btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ selectedYear }}년 {{ selectedMonth }}월
      </button>
      <ul class="dropdown-menu picker-menu">
        <!-- 년도 선택 -->
        <li class="picker-section-title">년도</li>
        <div class="year-list">
          <li v-for="year in years" :key="year">
            <button
              class="dropdown-item"
              :class="{ active: year === selectedYear }"
              @click="selectedYear = year"
            >
              {{ year }}년
            </button>
          </li>
        </div>
        <li><hr class="dropdown-divider" /></li>
        <!-- 월 선택 -->
        <li class="picker-section-title">월</li>
        <div class="month-grid">
          <button
            v-for="month in 12"
            :key="month"
            class="month-item"
            :class="{ active: month === selectedMonth }"
            @click="selectMonth(month)"
          >
            {{ month }}월
          </button>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    },
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedYear = ref(props.modelValue.year);
const selectedMonth = ref(props.modelValue.month);

const currentYear = new Date().getFullYear();
const years = computed(() =>
  Array.from({ length: 5 }, (_, i) => currentYear - 2 + i),
);

const selectMonth = (month) => {
  selectedMonth.value = month;
  emit('update:modelValue', {
    year: selectedYear.value,
    month: selectedMonth.value,
  });
};

watch(selectedYear, () => {
  emit('update:modelValue', {
    year: selectedYear.value,
    month: selectedMonth.value,
  });
});
</script>

<style scoped>
.month-picker {
  display: flex;
  justify-content: center;
}

.picker-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #545045;
  padding: 4px 12px;
}

.picker-btn:focus {
  box-shadow: none;
}

.picker-menu {
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 200px;
}

.picker-section-title {
  font-size: 0.75rem;
  color: #9e9e9e;
  font-weight: 600;
  padding: 4px 8px;
  list-style: none;
}

.year-list {
  display: flex;
  flex-direction: column;
}

.year-list .dropdown-item {
  border-radius: 8px;
  font-size: 0.9rem;
  color: #545045;
}

.year-list .dropdown-item.active {
  background-color: #ffcc00;
  color: #545045;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 4px 0;
}

.month-item {
  background: none;
  border: none;
  border-radius: 8px;
  padding: 6px 4px;
  font-size: 0.85rem;
  color: #545045;
  cursor: pointer;
  text-align: center;
  transition: background 0.15s;
}

.month-item:hover {
  background-color: #f5f5f5;
}

.month-item.active {
  background-color: #ffcc00;
  font-weight: 600;
}
</style>
