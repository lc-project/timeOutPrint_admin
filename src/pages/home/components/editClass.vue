<template>
  <div class="editClass">
    <el-dialog v-model="editClassShow" title="编辑分类" style="max-width: 1100px">
      <div class="data f" v-for="(item, index) in classData" :key="index">
        <div class="input ac">
          <el-input v-model="item.class">
            <template v-if="index === classData.length - 1" #append>
              <el-button type="primary" @click="addNewClass">添加新分类</el-button>
            </template>
          </el-input>
        </div>
        <div class="icon ac" @click="delClassBtn(item)">
          <i-delete-three theme="outline" size="24" fill="red" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="keep">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import home from "../store.js";
const { classData } = storeToRefs(home());
const editClassShow = defineModel();

function addNewClass() {
  classData.value.push({ class: "", data: [] });
}

function keep() {
  if (classData.value.some((obj) => obj.class === "")) {
    ElMessage({
      message: "分类名称不能留空",
      type: "warning",
    });
    return;
  }
  ElMessageBox.confirm("是否确认保存", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const stop = $dialogLoading();
    $axios
      .post("/printData/addPrintData", {
        data: classData.value,
      })
      .then(({ data }) => {
        stop();
        ElMessage.success("保存成功");
        home().getPrintData();
        editClassShow.value = false;
      })
      .catch(() => stop());
  });
}

function delClassBtn(item) {
  ElMessageBox.confirm("是否确认删除" + item.class, {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const index = classData.value.findIndex((obj) => obj.class === item.class && JSON.stringify(obj.data) === JSON.stringify(item.data));
    if (index !== -1) {
      classData.value.splice(index, 1);
    }
  });
}
</script>

<style lang="scss" scoped>
.editClass {
  .data {
    padding: 10px;
    width: 100%;
    .input {
      width: 95%;
    }
    .icon {
      width: 5%;

      margin-left: 20px;
    }
  }
}
</style>
