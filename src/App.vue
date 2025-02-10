<template>
  <router-view></router-view>
</template>
<script setup>
import * as echarts from "echarts";
provide("echarts", echarts);
import useStore from "@/store/modules/userStore.js";
const { hasRoutes } = storeToRefs(useStore());
onMounted(() => {
  hasRoutes.value = false;
});
</script>
