<template>
  <div class="chart-container">
    <chart height="100%" width="100%"></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/keyboard';

export default {
  name: 'keyboardChart',
  components: { Chart }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
</style>
