<template>
  <div class="pieChart">
    <div id="foldingLine" style="height: 800px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import statistics from "../store.js";
const { pieChartData } = storeToRefs(statistics());

onMounted(() => {
  statistics().getDataApi();
});

watch(pieChartData, (newData) => {
  if (newData && newData.length > 0) {
    foldingLine();
  }
});

function foldingLine() {
  let dom = document.getElementById("foldingLine");
  let myChart = echarts.init(dom, null, {});
  let option;

  const chartData = pieChartData.value.map((item) => ({
    value: item.count,
    name: item.title,
  }));

  option = {
    title: {
      text: "打印数据状态图信息",
      subtext: "状态数据",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
}
</script>

<style lang="scss" scoped></style>
