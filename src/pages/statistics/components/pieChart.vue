<template>
  <div class="pieChart">
    <div id="foldingLine" style="height: 800px"></div>
    {{ pieChartData }}
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as echarts from "echarts";
import statistics from "../store.js";
const { pieChartData } = storeToRefs(statistics());

onMounted(() => {
  statistics().getDataApi();
  foldingLine();
});

function foldingLine() {
  let dom = document.getElementById("foldingLine");
  let myChart = echarts.init(dom, null, {});
  let option;
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
        data: [
          { value: 1048, name: "被删除" },
          { value: 735, name: "报损" },
          { value: 580, name: "正常" },
          { value: 484, name: "已处理" },
        ],
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
