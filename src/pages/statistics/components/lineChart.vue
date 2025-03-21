<template>
  <div class="lineChart">
    <div id="container" style="height: 700px"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import statistics from "../store.js";
const { foldingLineData } = storeToRefs(statistics());

onMounted(() => {
  statistics().getDataApi();
});

watch(foldingLineData, (newData) => {
  if (newData && newData.length > 0) {
    lineChart();
  }
});

function lineChart() {
  let dom = document.getElementById("container");
  let myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });

  const xAxisData = foldingLineData.value.map((item) => item.time);
  const seriesData = foldingLineData.value.map((item) => item.count);
  let option = {
    title: {
      text: "近一周打印数量",
      subtext: "数量数据",
      left: "center",
    },
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: seriesData,
        type: "line",
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
}
</script>

<style lang="scss" scoped>
.lineChart {
}
</style>

<style lang="scss" scoped>
.lineChart {
}
</style>
