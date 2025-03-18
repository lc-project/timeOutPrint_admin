<template>
  <div class="home">
    <div class="jb">
      <div>
        <el-button type="primary" @click="editClassBtn">编辑分类</el-button>
      </div>
      <div>
        <el-button type="primary" @click="exportBtn">导出</el-button>
        <el-button type="primary" @click="reduction">一键还原数据</el-button>
      </div>
    </div>
    <div class="list">
      <div class="data" v-for="(item, index) in tableData" :key="index">
        <div class="jb">
          <div class="ac">
            {{ item.class }}
            <el-tag type="primary" style="margin-left: 10px">物料数量：{{ item.data.reduce((sum, item) => sum + item.children.length, 0) }}份</el-tag>
          </div>
          <div class="addClass">
            <el-button type="primary" @click="add(item)" round>添加物料</el-button>
            <el-button type="primary" @click="reviseClass(item)" round>修改大类名称</el-button>
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
            <div class="btn f">
              <el-button type="warning" size="small" round @click="editMaterials(items)">编辑物料</el-button>
              <el-button type="danger" size="small" round @click="delMaterials(items)">删除物料</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <newHome v-model="homeShow" />
    <newEdit v-model="editShow" />
    <updateClass v-model="classShow" />
    <editClass v-model="editClassShow" />
    <restoreData v-model="restoreShow" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import * as XLSX from "xlsx";
import newHome from "./components/newHome.vue";
import editClass from "./components/editClass.vue";
import newEdit from "./components/newEdit.vue";
import restoreData from "./components/restoreData.vue";
import updateClass from "./components/updateClass.vue";
import home from "./store.js";
const { tableData, form, materialsFrom, materialsClass, classData } = storeToRefs(home());

const editShow = ref(false);
const homeShow = ref(false);
const classShow = ref(false);
const editClassShow = ref(false);
const restoreShow = ref(false);
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

function exportBtn() {
  const worksheetData = [];
  const merges = [];
  let startRow = 1;
  tableData.value.forEach((item) => {
    const itemCount = item.data.reduce((count, subItem) => count + subItem.children.length, 0);
    item.data.forEach((subItem) => {
      subItem.children.forEach((child) => {
        // 分割名称和状态
        const [name, status] = child.name.split('-');
        worksheetData.push({
          分类: item.class,
          名称: name,
          状态: status || '',  // 如果状态不存在，则为空
          保质期: child.theTerm,
          储存条件: child.storage,
        });
      });
    });
    // 合并单元格
    if (itemCount > 1) {
      merges.push({
        s: { r: startRow, c: 0 },
        e: { r: startRow + itemCount - 1, c: 0 }
      });
    }
    startRow += itemCount;
  });
  // 创建工作簿
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  // 添加合并信息
  worksheet['!merges'] = merges;
  // 设置样式
  Object.keys(worksheet).forEach((cell) => {
    if (cell[0] === '!' || !worksheet[cell]) return;
    worksheet[cell].s = {
      font: {
        name: '宋体',
        sz: 11
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center'
      }
    };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 导出 Excel 文件
  XLSX.writeFile(workbook, "物料信息表格.xlsx");
}


function reviseClass(row) {
  const tempItems = JSON.parse(JSON.stringify(row));
  materialsClass.value = {
    ...tempItems,
  };
  classShow.value = true;
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
        item.children = item.children.filter(
          (child) =>
            !items.children.some((delItem) => delItem.name === child.name && delItem.storage === child.storage && delItem.theTerm === child.theTerm)
        );
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
//编辑分类
function editClassBtn() {
  const tempItems = JSON.parse(JSON.stringify(tableData.value));
  classData.value = tempItems;
  editClassShow.value = true;
}

//还原数据
function reduction() {
  restoreShow.value = true;
}
</script>

<style lang="scss" scoped>
.home {
  .list {
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
        }
      }
    }
  }
}
</style>
