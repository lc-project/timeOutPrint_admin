import { defineStore } from "pinia";
export default defineStore("statistics", {
  state() {
    return {
      pieChartData: [],
      foldingLineData: [],
    };
  },
  actions: {
    async getDataApi() {
      const { data } = await $axios.get("/statistics/getStatisticsData");
      //折线图数据
      this.foldingLineData = data.result;
      //饼图数据
      const stateCounts = {
        "-1": 0,
        0: 0,
        1: 0,
        2: 0,
      };
      data.stateQuantity.forEach((item) => {
        if (stateCounts.hasOwnProperty(item.state)) {
          stateCounts[item.state]++;
        }
      });
      // 将计数结果映射到需要的格式
      this.pieChartData = [
        { title: "被删除", count: stateCounts["-1"] },
        { title: "报损", count: stateCounts["0"] },
        { title: "正常", count: stateCounts["1"] },
        { title: "已处理", count: stateCounts["2"] },
      ];
    },
  },
  persist: false,
});
