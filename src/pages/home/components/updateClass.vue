<template>
  <div class="updateClass">
    <el-dialog v-model="classShow" title="大类名称" style="max-width: 800px">
      <div class="materialsContainer w">
        <div v-for="(item, index) in materialsClass.data" :key="index" class="materialItem">
          <el-form :inline="true" :model="materialsClass">
            <el-form-item label="物料大类">
              <el-input v-model="item.name" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="keep">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import home from "../store.js";

const { tableData, materialsClass } = storeToRefs(home());

const classShow = defineModel();

function keep() {
  tableData.value = tableData.value.map((item) => {
    if (item.class == materialsClass.value.class) {
      return materialsClass.value;
    }
    return item;
  });
  const stop = $dialogLoading();
  $axios
    .post("/printData/addPrintData", {
      data: tableData.value,
    })
    .then(({ data }) => {
      stop();
      ElMessage.success("编辑成功");
      home().getPrintData();
      classShow.value = false;
    })
    .catch(() => stop());
  // 关闭对话框
}
</script>

<style lang="scss" scoped>
.updateClass {
  .materialsContainer {
    max-height: 600px;
    overflow: auto;
    .materialItem {
      flex: 1 0 auto;
      margin: 20px;
      min-width: 200px;
    }
  }
}
</style>
