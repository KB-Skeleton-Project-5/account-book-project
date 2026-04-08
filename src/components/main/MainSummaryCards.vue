<template>
  <section class="summary-cards">
    <div class="summary-card">
      <p class="card-month">00월</p>
      <p class="card-amount">2,458,146원</p>
    </div>
    <div class="summary-card">
      <p class="card-month">00월</p>
      <p class="card-amount">2,458,146원</p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.summary-card {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}
.card-month {
  font-size: 1.1rem;
  font-weight: 700;
  color: #545045;
  margin-bottom: 8px;
}
.card-amount {
  font-size: 0.85rem;
  color: #545045;
  text-align: right;
}
</style>
