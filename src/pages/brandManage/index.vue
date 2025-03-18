<template>
  <div class="brand">
    <vxe-toolbar custom ref="toolbarRef">
      <template #buttons>
        <el-button type="primary" @click="add">
          <template #icon>
            <i-add-one theme="outline" size="24" fill="#fff" />
          </template>
          新增
        </el-button>
      </template>
    </vxe-toolbar>
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="tableData">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="name" title="品牌名称"></vxe-column>
      <vxe-column title="操作" width="240">
        <template #default="{ row }">
          <vxe-button mode="text" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="$emit('confirm', row)" v-if="props.type">选择</vxe-button>
          <vxe-button mode="text" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="editEvent(row)">编辑</vxe-button>
          <vxe-button mode="text" icon="vxe-icon-delete" style="color: red; font-weight: 900" @click="removeEvent(row)">删除</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      @page-change="brandManage().getDataApi()"
      background
      v-model:current-page="pageValue.page"
      v-model:page-size="pageValue.limit"
      :total="pageValue.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
    <newBrand v-model="brandShow" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import newBrand from "./components/newBrand.vue";
import brandManage from "./store.js";
const { tableData, pageValue, form } = storeToRefs(brandManage());
const brandShow = ref(false);

const props = defineProps({
  type: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  brandManage().getDataApi();
});

function add() {
  form.value = {
    state: "新增",
  };
  brandShow.value = true;
}
function editEvent(row) {
  form.value = {
    state: "编辑",
    ...row,
    password: "",
  };
  brandShow.value = true;
}
function removeEvent(row) {
  const id = row.id;
  ElMessageBox.confirm("是否删除", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $axios
      .post("/brand/delBrand", {
        id: id,
      })
      .then(() => {
        if (tableData.value.length === 1 && pageValue.value.page !== 1) {
          pageValue.value.page--;
        }
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        brandManage().getDataApi();
      });
  });
}
</script>

<style lang="scss" scoped></style>
