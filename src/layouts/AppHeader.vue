<template>
  <header class="app-header">
    <span class="header-title">{{ title }}</span>
    <div class="header-icons">
      <button
        class="icon-btn"
        aria-label="캘린더"
        @click="$router.push({ name: 'calendars' })"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
      <button
        class="icon-btn"
        aria-label="프로필"
        @click="$router.push({ name: 'users/info' })"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.app-header {
  position: relative;
  width: 100%;
  height: 52px;
  background-color: #ffbc00;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.05rem;
  font-weight: 700;
  color: #545045;
  letter-spacing: -0.3px;
  white-space: nowrap;
}

.header-icons {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #545045;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: background 0.15s;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}
</style>
