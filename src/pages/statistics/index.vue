<template>
  <div class="statistics">
    <div class="analyze">
      <div class="foldingLine">
        <lineChart />
      </div>
      <div class="pieChart">
        <pieChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import lineChart from "./components/lineChart.vue";
import pieChart from "./components/pieChart.vue";

</script>

<style lang="scss" scoped>
.statistics {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .analyze {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    .foldingLine {
      flex: 1;
    }
    .pieChart {
      flex: 1;
    }
  }

  @media (max-width: 768px) {
    .analyze {
      flex-direction: column;
    }
  }
}
</style>
