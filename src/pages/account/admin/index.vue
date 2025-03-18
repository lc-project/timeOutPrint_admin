<template>
  <div class="account">
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="tableData">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="username" title="账号"></vxe-column>
      <vxe-column field="identity" title="身份"></vxe-column>
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
    <newAccount v-model="accountShow"/>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import account from "../store.js";
import newAccount from "../components/newAccount.vue";
const { tableData, pageValue, identity, form } = storeToRefs(account());

const accountShow = ref(false);

onMounted(() => {
  identity.value = "超级管理员";
  account().getDataApi();
});

function editEvent(row) {
  form.value = {
    state: "编辑",
    authId: 1,
    ...row,
    password: "",
  };
  accountShow.value = true;
}
function removeEvent(row) {}
</script>

<style lang="scss" scoped></style>
