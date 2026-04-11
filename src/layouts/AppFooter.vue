<template>
  <nav class="app-footer">
    <router-link :to="{ name: 'main' }" class="nav-item">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
      <span>HOME</span>
    </router-link>

    <router-link :to="{ name: 'expenses' }" class="nav-item">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="7" y1="9" x2="17" y2="9" />
        <line x1="7" y1="13" x2="13" y2="13" />
      </svg>
      <span>지출</span>
    </router-link>

    <router-link :to="{ name: 'expenses/add' }" class="nav-item nav-add">
      <div class="add-btn">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
    </router-link>

    <router-link :to="{ name: 'summaries' }" class="nav-item">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
      <span>월별요약</span>
    </router-link>

    <router-link :to="{ name: 'challenges' }" class="nav-item">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          d="M12 2C8 2 5 5.5 5 9c0 4 4 8 7 11 3-3 7-7 7-11 0-3.5-3-7-7-7z"
        />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
      <span>챌린지</span>
    </router-link>
  </nav>
</template>

<script setup></script>

<style scoped>
.app-footer {
  width: 100%;
  height: 64px;
  background-color: #ffffff;
  border-top: 1px solid #ebebeb;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 4px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: #9e9e9e;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 6px 0;
  transition: color 0.15s;
}

.nav-item.router-link-active {
  color: #ffbc00;
}

/* 가운데 + 버튼 */
.nav-add {
  position: relative;
  top: -14px;
}

.add-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffbc00;
  color: #545045;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s;
}

.nav-add:hover .add-btn {
  transform: scale(1.07);
}
</style>
