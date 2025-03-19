<template>
  <div class="check">
    <el-dialog v-model="checkShow" title="物料信息" top="1vh" style="width: 90%" @opened="onOpen">
      <div class="jb">
        <div>
          <el-button type="primary" @click="editClassBtn" v-if="tableData.length !== 0">
            <template #icon>
              <i-editor theme="outline" size="24" fill="#fff" />
            </template>
            编辑分类
          </el-button>
          <el-button type="primary" @click="open" v-if="tableData.length == 0">
            <template #icon>
              <i-to-top theme="outline" size="24" fill="#fff" />
            </template>
            导入数据
          </el-button>
        </div>
        <div>
          <el-button type="primary" @click="exportBtn" v-if="tableData.length !== 0">
            <template #icon>
              <i-to-bottom theme="outline" size="24" fill="#fff" />
            </template>
            导出数据
          </el-button>
          <el-button type="primary" @click="reduction" v-if="tableData.length !== 0">
            <template #icon>
              <i-recycle-bin theme="outline" size="24" fill="#fff" />
            </template>
            一键还原数据
          </el-button>
        </div>
      </div>
      <div class="classify">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tableData" :key="index" :label="item.class" :name="item.class"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="list">
        <div class="data" v-for="(item, index) in filteredData" :key="index">
          <div class="jb">
            <div class="ac">
              {{ item.class }}
              <el-tag type="primary" style="margin-left: 10px">
                物料数量：{{ item.data.reduce((sum, item) => sum + item.children.length, 0) }}份
              </el-tag>
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
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import newHome from "./newHome.vue";
import editClass from "./editClass.vue";
import newEdit from "./newEdit.vue";
import restoreData from "./restoreData.vue";
import updateClass from "./updateClass.vue";
import home from "../store.js";
const { tableData, form, materialsFrom, materialsClass, classData, id, ids } = storeToRefs(home());
import { useFileDialog } from "@vueuse/core";
const { files, open, reset, onChange } = useFileDialog({
  multiple: false,
  reset: true,
  accept: "xls,xlsx",
  directory: false,
});

const checkShow = defineModel();
const activeName = ref("");
const selectedClass = ref("");
function onOpen() {
  if (tableData.value.length > 0) {
    const item = tableData.value[0];
    activeName.value = item.class;
    selectedClass.value = item.class;
  }
}

const editShow = ref(false);
const homeShow = ref(false);
const classShow = ref(false);
const editClassShow = ref(false);
const restoreShow = ref(false);

const filteredData = computed(() => {
  if (selectedClass.value && tableData.value) {
    return tableData.value.filter((item) => item.class === selectedClass.value);
  }
  return tableData.value;
});

function handleClick(tab) {
  selectedClass.value = tab.props.name;
}

function add(item) {
  homeShow.value = true;
  form.value = {
    class: item.class,
    ...item,
  };
}
onChange((files) => {
  if (files) readExcel(files[0]);
});

async function readExcel(file) {
  const loading = ElLoading.service({
    lock: true,
    text: "上传文件中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const arrayBuffer = await file.arrayBuffer();
  const tableData = [];
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(arrayBuffer);
    const excelData = workbook.worksheets.map((sheet) => {
      return sheet.name;
    });
    // 获取第一个工作表
    excelData.forEach((element) => {
      const worksheet = workbook.getWorksheet(element);
      // 读取工作表中的数据
      worksheet?.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        // 去掉表头
        if (rowNumber >= 2) {
          const newData = {
            name: row.values[2],
            children: [
              {
                name: row.values[2] + "-" + row.values[3],
                theTerm: row.values[4],
                storage: row.values[5],
              },
            ],
          };
          const existingEntryIndex = tableData.findIndex((entry) => entry.class === row.values[1]);
          if (existingEntryIndex !== -1) {
            const existingDataEntryIndex = tableData[existingEntryIndex].data.findIndex((dataEntry) => dataEntry.name === row.values[2]);
            if (existingDataEntryIndex !== -1) {
              tableData[existingEntryIndex].data[existingDataEntryIndex].children.push(...newData.children);
            } else {
              tableData[existingEntryIndex].data.push(newData);
            }
          } else {
            tableData.push({
              class: row.values[1],
              data: [newData],
            });
          }
        }
      });
    });
    $axios
      .post("/printData/importData", {
        id: ids.value,
        data: tableData,
      })
      .then(({ data }) => {
        ElMessage.success("数据导入成功");
        checkShow.value = false;
        home().getPrintData();
      });
    loading.close();
  } catch (error) {
    ElMessage.success("数据导入失败");
  }
  reset();
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
        const [name, status] = child.name.split("-");
        worksheetData.push({
          分类: item.class,
          名称: name,
          状态: status || "", // 如果状态不存在，则为空
          保质期: child.theTerm,
          储存条件: child.storage,
        });
      });
    });
    // 合并单元格
    if (itemCount > 1) {
      merges.push({
        s: { r: startRow, c: 0 },
        e: { r: startRow + itemCount - 1, c: 0 },
      });
    }
    startRow += itemCount;
  });
  // 创建工作簿
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  // 添加合并信息
  worksheet["!merges"] = merges;
  // 设置样式
  Object.keys(worksheet).forEach((cell) => {
    if (cell[0] === "!" || !worksheet[cell]) return;
    worksheet[cell].s = {
      font: {
        name: "宋体",
        sz: 11,
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
      },
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
        id: id.value,
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
.check {
  .list {
    .data {
      padding: 10px;
      background-color: rgb(238, 233, 233);
      border-radius: 10px;
      .dataBox {
        background-color: #ffffff;
        margin-top: 5px;
        border-radius: 10px;
        overflow: auto;
        height: 70vh;
        padding: 5px;
        .materials {
          width: 85%;
        }
      }
    }
  }
}
</style>
