<template>
  <div class="newEdit">
    <el-dialog v-model="editShow" :title="materialsFrom.name" style="max-width: 1100px">
      <div class="data jb" v-for="(item, index) in materialsFrom.children" :key="index">
        <div class="form">
          <el-form :inline="true" :model="materialsFrom">
            <el-form-item label="物料名称">
              <el-input v-model="item.name" />
            </el-form-item>
            <el-form-item label="效期时间(天/小时/分/秒/打烊废弃)">
              <el-input v-model="item.theTerm" style="max-width: 110px" />
            </el-form-item>
            <el-form-item label="存储方式">
              <el-input v-model="item.storage" />
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <i-delete-three theme="outline" size="25" fill="#d0021b" @click="delMaterials(item)" />
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
import home from "../store.js";
const { tableData, materialsFrom } = storeToRefs(home());

const editShow = defineModel();

function delMaterials(item) {
  if (materialsFrom.value.children.length <= 1) {
    ElMessage({
      message: "最少保持一条数据",
      type: "warning",
    });
    return;
  }
  // 使用 filter 方法过滤掉指定的 item
  materialsFrom.value.children = materialsFrom.value.children.filter(
    (child) => !(child.name === item.name && child.theTerm === item.theTerm && child.storage === item.storage)
  );
}

function keep() {
  tableData.value = tableData.value.map((category) => {
    category.data = category.data.map((item) => {
      if (item.name === materialsFrom.value.name) {
        return materialsFrom.value;
      }
      return item;
    });
    return category;
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
      editShow.value = false;
    })
    .catch(() => stop());
}
</script>

<style lang="scss" scoped>
.newEdit {
  .data {
    .form {
      width: 90%;
    }
    .btn {
      width: 10%;
      margin-top: 5px;
    }
  }
}
</style>
