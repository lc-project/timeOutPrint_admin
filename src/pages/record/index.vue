<template>
  <div class="record">
    <vxe-table :data="tableData">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="name" title="品牌"></vxe-column>
      <vxe-column field="shopName" title="店铺名称"></vxe-column>
      <vxe-column field="data.name" title="物料名称"></vxe-column>
      <vxe-column field="data.theTerm" title="效期时间"></vxe-column>
      <vxe-column field="data.storage" title="存储方式"></vxe-column>
      <vxe-column field="data.printTime" title="打印时间">
        <template #default="{ row }">
          {{ formatTime(row.data.printTime) }}
        </template>
      </vxe-column>
      <vxe-column field="data.expireTime" title="过期时间">
        <template #default="{ row }">
          {{ formatTime(row.data.expireTime) }}
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      @page-change="getPrintLog()"
      background
      v-model:current-page="pageValue.page"
      v-model:page-size="pageValue.limit"
      :total="pageValue.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
  </div>
</template>
·
<script setup>
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
function formatTime(time) {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}

const tableData = ref([]);

const pageValue = ref({
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
});
onMounted(async () => {
  await getPrintLog();
});

async function getPrintLog() {
  pageValue.value.loading = true;
  const { data } = await $axios.get("/printLog/getPrintLog", {
    params: {
      limit: pageValue.value.limit,
      page: pageValue.value.page,
    },
  });
  if (data.total || data.total == 0) {
    pageValue.value.total = data.total;
  }
  tableData.value = data.data;
  // 解析 tableData.value 中的 data 字段
  tableData.value = tableData.value.map((item) => {
    item.data = JSON.parse(item.data);
    return item;
  });
  pageValue.value.loading = false;
}
</script>

<style lang="scss" scoped></style>
