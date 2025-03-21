<template>
  <div class="validityPeriod">
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="tableData" style="margin-top: 10px">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="brandName" title="品牌名称"></vxe-column>
      <vxe-column field="shopName" title="店铺名称"></vxe-column>
      <vxe-column title="操作" width="200">
        <template #default="{ row }">
          <vxe-button mode="text" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="check(row)">查看图片</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      @page-change="validityPeriod().getDataApi()"
      background
      v-model:current-page="pageValue.page"
      v-model:page-size="pageValue.limit"
      :total="pageValue.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
    <waterfallFlow v-model="pictureShow" />
  </div>
</template>

<script setup>
import waterfallFlow from "./components/waterfallFlow.vue";
import validityPeriod from "./store.js";
const { tableData, pageValue, id } = storeToRefs(validityPeriod());
onMounted(() => {
  validityPeriod().getDataApi();
});

const pictureShow = ref(false);

function check(row) {
  id.value = row.id;
  pictureShow.value = true;
  validityPeriod().getValidityPeriod();
}
</script>

<style lang="scss" scoped></style>
