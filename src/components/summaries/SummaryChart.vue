<template>
  <div class="chart-section">

    <div class="pie-chart"></div>

  </div>
</template>

<script setup>
</script>

<style scoped>

.chart-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* 그냥 색 나뉜 동그라미 */

.pie-chart {
  width: 160px;
  height: 160px;
  border-radius: 50%;

  background: conic-gradient(
    #f2d778 0% 40%,   
    #f5e6a3 40% 65%,  
    #e6c95c 65% 85%,  
    #fff4c2 85% 100%  
  );
}

</style>