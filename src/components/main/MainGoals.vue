<template>
  <section class="goal-section">
    <div class="goal-header">
      <h2 class="section-title">🔥 목표 달성까지 !</h2>
      <span class="more-btn">+ 더보기</span>
    </div>
    <div class="goal-item">
      <div class="progress-bar">
        <div class="progress-fill" style="width: 60%"></div>
      </div>
      <p class="goal-label">이번달 식비 줄이기 !</p>
    </div>
    <div class="goal-item">
      <div class="progress-bar">
        <div class="progress-fill" style="width: 40%"></div>
      </div>
      <p class="goal-label">이번달 식비 줄이기 !</p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #545045;
  margin-bottom: 8px;
}
.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.more-btn {
  font-size: 0.8rem;
  color: #9E9E9E;
  cursor: pointer;
}
.goal-item { margin-bottom: 12px; }
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 6px;
}
.progress-fill {
  height: 100%;
  background: #FFCC00;
  border-radius: 4px;
}
.goal-label {
  font-size: 0.85rem;
  color: #545045;
}
</style>
