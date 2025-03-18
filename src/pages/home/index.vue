<template>
  <div class="index">
    <vxe-table :column-config="{ resizable: true }" border :data="brandData">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="name" title="品牌物料"></vxe-column>
      <vxe-column title="操作" width="150">
        <template #default="{ row }">
          <vxe-button mode="text" icon="vxe-icon-eye-fill" style="color: #3883fa; font-weight: 900" @click="check(row)">查看物料信息</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      @page-change="home().getDataApi()"
      background
      v-model:current-page="pageValue.page"
      v-model:page-size="pageValue.limit"
      :total="pageValue.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
    <checkData v-model="checkShow" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import checkData from "./components/check.vue";
import home from "./store.js";
const { brandData, pageValue,id } = storeToRefs(home());

const checkShow = ref(false);

onMounted(() => {
  home().getDataApi();
});

function check(row) {
  id.value = row.id
  home().getPrintData();
  checkShow.value = true;
}
</script>

<style lang="scss" scoped></style>
