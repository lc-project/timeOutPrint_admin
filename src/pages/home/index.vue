<template>
  <div class="home">
    <div class="data" v-for="(item, index) in tableData" :key="index">
      <div class="jb">
        <div>
          {{ item.class }}
        </div>
        <div class="addClass">
          <el-button type="primary" @click="add(item)" round>添加物料</el-button>
        </div>
      </div>
      <div class="dataBox">
        <div class="jb" v-for="(items, indexs) in item.data" :key="indexs">
          <div class="materials">
            <el-descriptions :title="items.name">
              <div v-for="(itemS, indexS) in items.children" :key="indexS">
                <div>
                  <el-descriptions-item label="物料名称">
                    {{ itemS.name }}
                  </el-descriptions-item>
                  <el-descriptions-item label="物料效期">
                    {{ itemS.theTerm }}
                  </el-descriptions-item>
                  <el-descriptions-item label="存储方式">
                    {{ itemS.storage }}
                  </el-descriptions-item>
                </div>
              </div>
            </el-descriptions>
          </div>
          <div class="btn">
            <el-button type="warning" size="small" round @click="editMaterials(items)">编辑物料</el-button>
            <el-button type="danger" size="small" round @click="delMaterials(items)">删除物料</el-button>
          </div>
        </div>
      </div>
    </div>
    <newHome v-model="homeShow" />
    <newEdit v-model="editShow" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import newHome from "./components/newHome.vue";
import newEdit from "./components/newEdit.vue";
import home from "./store.js";
const { tableData, form, materialsFrom } = storeToRefs(home());

const editShow = ref(false);
const homeShow = ref(false);
onMounted(() => {
  home().getPrintData();
});

function add(item) {
  homeShow.value = true;
  form.value = {
    class: item.class,
    ...item,
  };
}

function editMaterials(items) {
  const tempItems = JSON.parse(JSON.stringify(items));
  materialsFrom.value = {
    ...tempItems,
  };
  editShow.value = true;
}

function delMaterials(items) {
  ElMessageBox.confirm("是否删除" + items.name, {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    tableData.value.forEach((category) => {
      category.data = category.data.reduce((acc, item) => {
        item.children = item.children.filter((child) => !items.children.some((delItem) => delItem.name === child.name));
        if (item.children.length > 0) {
          acc.push(item);
        }
        return acc;
      }, []);
    });
    const stop = $dialogLoading();
    $axios
      .post("/printData/addPrintData", {
        data: tableData.value,
      })
      .then(({ data }) => {
        stop();
        ElMessage.success("删除成功");
        home().getPrintData();
      })
      .catch(() => stop());
  });
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  .data {
    padding: 10px;
    background-color: rgb(218, 209, 209);
    border-radius: 10px;
    margin-top: 20px;
    .addClass {
    }
    .dataBox {
      background-color: #ffffff;
      margin-top: 5px;
      height: 400px;
      border-radius: 10px;
      overflow: auto;
      padding: 5px;
      .materials {
        width: 85%;
      }
      .btn {
        width: 15%;
      }
    }
  }
}
</style>
