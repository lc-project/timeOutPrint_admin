<template>
  <div class="lineChart">
    <div id="container" style="height: 700px"></div>
    {{ foldingLineData }}
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as echarts from "echarts";
import statistics from "../store.js";
const { foldingLineData } = storeToRefs(statistics());

onMounted(() => {
  statistics().getDataApi();
  lineChart();
});

function lineChart() {
  console.log("%c Line:20 🍰", "background:#4fff4B",foldingLineData.value);
  let dom = document.getElementById("container");
  let myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let option;
  option = {
    xAxis: {
      type: "category",
      data: ["大湾区站", "苏州站", "温州站", "金赛特邀站", "西安站"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
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
