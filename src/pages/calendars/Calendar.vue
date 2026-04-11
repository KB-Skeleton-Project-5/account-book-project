<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정" />
    </template>

    <div class="calendar-page">
      <!-- 달력 카드 -->
      <div class="calendar-card">
        <div class="month-bar">
          <!--왼쪽 : 날짜 선택 -->
          <div class="month-left">
            <MonthPicker v-model="selectedDate" />
          </div>
          <!-- 오른쪽: 추가 버튼 -->
          <div class="month-right">
            <AppButton text="추가" @click="handleAdd" />
          </div>
        </div>

        <div class="calendar-box">
          <div class="week-row">
            <div class="week-cell" v-for="day in weekDays" :key="day">
              {{ day }}
            </div>
          </div>

          <div class="date-grid">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="date-cell"
              :class="{ empty: !day, selected: day === selectedDay }"
              @click="selectDay(day)"
            >
              <template v-if="day">
                <span class="day-number">{{ day }}</span>
                <span v-if="eventDays.includes(day)" class="event-dot"></span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 일정 리스트 -->
      <div class="calendar-section">
        <div class="calendar-date">📅 {{ selectedDayText }} 일정</div>

        <template v-if="filteredCalendars.length > 0">
          <CalendarItem
            v-for="item in filteredCalendars"
            :key="item.id"
            :id="item.id"
            :title="item.title"
            :time="item.time"
          />
        </template>

        <div v-else class="empty-text">해당 날짜의 일정이 없습니다.</div>
      </div>
    </div>
    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MonthPicker from '@/components/commons/MonthPicker.vue';
import AppButton from '@/components/commons/AppButton.vue';
import CalendarItem from '@/components/calendars/CalendarItem.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import { getUserInfo } from '@/util/authUtil';

const router = useRouter();
const today = new Date();

const savedDate = JSON.parse(sessionStorage.getItem('calendarSelectedDate'));

const selectedDate = ref({
  year: savedDate?.year || today.getFullYear(),
  month: savedDate?.month || today.getMonth() + 1,
});

const selectedDay = ref(savedDate?.day || 1);

watch(
  [selectedDate, selectedDay],
  () => {
    sessionStorage.setItem(
      'calendarSelectedDate',
      JSON.stringify({
        year: selectedDate.value.year,
        month: selectedDate.value.month,
        day: selectedDay.value,
      }),
    );
  },
  { deep: true },
);

watch(
  () => `${selectedDate.value.year}-${selectedDate.value.month}`,
  () => {
    selectedDay.value = 1;
  },
);

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const selectedDayText = computed(() => {
  return `${selectedDate.value.year}년 ${selectedDate.value.month}월 ${selectedDay.value}일`;
});

const calendarList = ref([]);

const handleAdd = () => {
  router.push({ name: 'calendars/add' });
};

const fetchCalendars = async () => {
  try {
    const { id } = getUserInfo(); // localStorage에서 꺼내기
    const res = await axios.get('/api/calendars', {
      params: { user_id: id }, // user_id 파라미터로 넘기기
    });
    calendarList.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

const monthlyCalendars = computed(() => {
  return calendarList.value.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getFullYear() === selectedDate.value.year &&
      itemDate.getMonth() + 1 === selectedDate.value.month
    );
  });
});

const filteredCalendars = computed(() => {
  return monthlyCalendars.value.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getDate() === selectedDay.value;
  });
});

const eventDays = computed(() => {
  return monthlyCalendars.value.map((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getDate();
  });
});

const calendarDays = computed(() => {
  const year = selectedDate.value.year;
  const month = selectedDate.value.month;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= lastDate; day++) {
    days.push(day);
  }

  return days;
});

const selectDay = (day) => {
  if (!day) return;
  selectedDay.value = day;
};

onMounted(() => {
  fetchCalendars();
});
</script>

<style scoped>
.calendar-page {
  padding: 18px;
  background-color: #f3f3f3;
  box-sizing: border-box;
  min-height: 100%;
}

.calendar-card {
  background-color: #e9e9e9;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 18px;
}

.month-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.month-left {
  display: flex;
  align-items: center;
}

.month-right {
  display: flex;
  align-items: center;
}

.calendar-box {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 14px;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}

.week-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.date-cell {
  height: 42px;
  border-radius: 10px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.date-cell.empty {
  background-color: transparent;
  cursor: default;
}

.date-cell.selected {
  background-color: #f3ecd6;
  font-weight: 700;
}

.day-number {
  font-size: 14px;
  color: #222;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ffbc00;
  margin-top: 4px;
}

.empty-text {
  font-size: 13px;
  color: #666;
  padding: 8px 0;
}

.calendar-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calendar-date {
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
  color: #222;
}
</style>
