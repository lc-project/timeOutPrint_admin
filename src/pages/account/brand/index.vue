<template>
  <div class="account">
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="tableData">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="username" title="账号"></vxe-column>
      <vxe-column field="name" title="名称"></vxe-column>
      <vxe-column field="code" title="店铺编码"></vxe-column>
      <vxe-column field="storeName" title="店铺名称"></vxe-column>
      <vxe-column field="brand" title="店铺品牌"></vxe-column>
      <vxe-column title="操作" width="150">
        <template #default="{ row }">
          <vxe-button mode="text" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="editEvent(row)">编辑</vxe-button>
          <vxe-button mode="text" icon="vxe-icon-delete" style="color: red; font-weight: 900" @click="removeEvent(row)">删除</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      @page-change="account().getDataApi()"
      background
      v-model:current-page="pageValue.page"
      v-model:page-size="pageValue.limit"
      :total="pageValue.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import account from "../store.js";
const { tableData, pageValue, identity, form } = storeToRefs(account());

onMounted(() => {
  identity.value = "品牌管理员";
  account().getDataApi();
});

function editEvent(row) {}
function removeEvent(row) {}
</script>

<style lang="scss" scoped></style>
