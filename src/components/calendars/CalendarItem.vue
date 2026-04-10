<template>
  <router-link :to="{ name: 'calendars/info', params: { id } }" 
    class="calendar-item-link"
    >
      <div class="calendar-item">
        <div class="calendar-title">{{ title }}</div>
        <div class="calendar-time" v-if="time">{{ time }}</div>
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
    default: '',
  },
  title: {
    type: String,
     required: true,
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

.calendar-item-link {
  text-decoration: none;
  color: inherit;
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