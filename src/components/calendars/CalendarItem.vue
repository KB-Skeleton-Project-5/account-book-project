<template>
  <router-link :to="{ name: 'calendars/info', params: { id } }" class="calendar-item-link">
      <div class="calendar-item">
        <div class="calendar-title">{{ title }}</div>
        <div class="calendar-time">{{ time }}</div>
      </div>
  </router-link>
</template>

<script setup>
defineProps({
  id: {
    type:[Number, String],
    required: true,
  },
  time: {
    type: String,
    default: '14:00',
  },
  title: {
    type: String,
    default: '회의',
  },
});
</script>

<style scoped>
.calendar-item {
  background-color: #f3ecd6;
  border-radius: 16px;
  padding: 10px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 36px;
  justify-content: center;
}

.calendar-title {
  font-size: 13px;
  color: #222;
  line-height: 1.2;
}

.calendar-time {
  font-size: 11px;
  color: #444;
  line-height: 1.2;
}
</style>