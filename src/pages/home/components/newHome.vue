<template>
  <div class="newShow">
    <el-dialog v-model="homeShow" :title="form.class" style="max-width: 1100px">
      <div class="data">
        <el-form :model="form">
          <el-form-item label="物料信息">
            <el-select
              v-model="formData.info"
              :multiple="false"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="请选择"
              style="width: 240px">
              <el-option v-for="item in form.data" :key="item.name" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item label="物料名称">
            <el-input v-model="formData.name" placeholder="输入物料名称" />
          </el-form-item>
          <el-form-item label="效期时间(天/小时/分/秒/打烊废弃)">
            <el-input v-model="formData.theTerm" placeholder="输入效期时间" />
          </el-form-item>
          <el-form-item label="存储方式">
            <el-input v-model="formData.storage" placeholder="输入存储方式" />
          </el-form-item>
        </el-form>
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
const { tableData, form } = storeToRefs(home());
const homeShow = defineModel();

const formData = ref({
  info: "",
  name: "",
  theTerm: "",
  storage: "",
});

function keep() {
  const classValue = form.value.class;
  const infoValue = formData.value.info;
  const nameToAdd = formData.value.name;
  const theTermToAdd = formData.value.theTerm;
  const storageToAdd = formData.value.storage;
  const matchingClass = tableData.value.find((item) => item.class === classValue);
  if (matchingClass) {
    const matchingItem = matchingClass.data.find((item) => item.name === infoValue);
    if (matchingItem) {
      matchingItem.children.push({
        name: nameToAdd,
        theTerm: theTermToAdd,
        storage: storageToAdd,
      });
    } else {
      matchingClass.data.push({
        name: infoValue,
        children: [
          {
            name: nameToAdd,
            theTerm: theTermToAdd,
            storage: storageToAdd,
          },
        ],
      });
    }
  } else {
    tableData.value.push({
      class: classValue,
      data: [
        {
          name: infoValue,
          children: [
            {
              name: nameToAdd,
              theTerm: theTermToAdd,
              storage: storageToAdd,
            },
          ],
        },
      ],
    });
  }
  const stop = $dialogLoading();
  $axios
    .post("/printData/addPrintData", {
      data: tableData.value,
    })
    .then(({ data }) => {
      stop();
      ElMessage.success(data);
      home().getPrintData();
      homeShow.value = false;
    })
    .catch(() => stop());
  formData.value = {};
}
</script>

<style lang="scss" scoped></style>
