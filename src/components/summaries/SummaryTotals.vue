<template>
  <div>

    <div class="total-item">
      <span>총 수입</span>
      <strong>500,000원</strong>
    </div>

    <div class="total-item">
      <span>총 지출</span>
      <strong>300,000원</strong>
    </div>

    <div class="total-item">
      <span>순이익</span>
      <strong>200,000원</strong>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.total-item {
  height: 34px;
  border: 1px solid #777;
  background-color: #ffffff;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 12px;
  margin-bottom: 8px;

  box-sizing: border-box;
}
</style>