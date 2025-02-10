<template>
  <div class="manager">
    <el-drawer v-model="showDialog" size="60%" title="文件池" direction="rtl">
      <vxe-toolbar>
        <template #buttons>
          <div class="f">
            <el-button type="primary" @click="uploadFiles">
              <template #icon>
                <i-add-one theme="outline" size="24" fill="#fff" />
              </template>
              上传文件
            </el-button>
            <el-input style="margin-left: 5px" v-model="selectInputValue" type="search" placeholder="搜索文件" @keydown.enter="getData">
              <template #append>
                <el-button
                  @click="
                    selectValue = selectInputValue;
                    getData();
                  ">
                  搜索
                </el-button>
              </template>
            </el-input>
          </div>
        </template>
      </vxe-toolbar>
      <vxe-table height="700" border :data="tableData">
        <vxe-column type="seq" width="70"></vxe-column>
        <vxe-column field="name" title="文件名称"></vxe-column>
        <vxe-column field="size" title="文件大小">
          <template #default="{ row }">
            <span>{{ formatFileSize(Number(row.size)) }}</span>
          </template>
        </vxe-column>
        <vxe-column field="create_time" title="上传时间" sortable>
          <template #default="{ row }">
            <span>{{ formatTime(row.create_time) }}</span>
          </template>
        </vxe-column>
        <vxe-column field="age" title="操作">
          <template #default="{ row }">
            <vxe-button mode="text" icon="vxe-icon-arrows-down" style="color: #3883fa; font-weight: 900" @click="dowFile(row)">下载</vxe-button>
            <vxe-button mode="text" icon="vxe-icon-delete" style="color: red; font-weight: 900" @click="delItem(row)">删除</vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        @page-change="getData"
        background
        v-model:current-page="pageValue.page"
        v-model:page-size="pageValue.limit"
        :total="pageValue.total"
        :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
    </el-drawer>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { useFileDialog } from "@vueuse/core";

const { open, reset, onChange } = useFileDialog();

const props = defineProps({
  filePoolGroupId: {
    type: String,
  },
});
const showDialog = defineModel({
  default: false,
}); //显示弹窗

watch(showDialog, (val) => {
  reset();
});

const tableData = ref([]); //表格数据
const selectValue = ref(""); //正在搜索的数据
const selectInputValue = ref(""); //搜索框里输入的内容
//分页信息
const pageValue = ref({
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
});

function getData() {
  $axios
    .get("/file/getFileList", {
      params: {
        id: props.filePoolGroupId,
        page: pageValue.value.page,
        limit: pageValue.value.limit,
        select: selectValue.value,
      },
    })
    .then(({ data }) => {
      tableData.value = data.data;
      pageValue.value.total = data.total;
    });
}

//删除文件
function delItem(row) {
  ElMessageBox.confirm("是否删除该文件?", "提示", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $axios
      .post("/file/delFile", {
        id: props.filePoolGroupId,
        fileId: row.id,
      })
      .then((res) => {
        ElMessage.success("删除成功!");
        if (tableData.value.length === 1 && pageValue.value.page !== 1) {
          pageValue.value.page--;
        }
        getData();
      });
  });
}

//初始化信息获取
onMounted(() => {
  if (!props.filePoolGroupId) return ElMessage.error("文件池信息获取失败!");
  getData();
});

//上传文件
async function uploadFiles() {
  const files = await new Promise((resolve, reject) => {
    open();
    onChange((files) => {
      resolve(files);
    });
  });
  if (!files.length) return ElMessage.error("请选择文件!");
  const formData = new FormData();
  formData.append("id", props.filePoolGroupId);
  [...files].forEach((file, index) => {
    // 使用 encodeURIComponent 来编码文件名
    const encodedFileName = encodeURIComponent(file.name);
    formData.append(`file${index + 1}`, file, encodedFileName);
  });
  const loading = ElLoading.service({
    lock: true,
    text: "上传中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  $axios
    .post("/file/uploadFiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(async (response) => {
      ElMessage.success("文件上传成功!");
      reset();
      await nextTick();
      getData();
      loading.close();
    })
    .catch(async (error) => {
      ElMessage.error("文件上传失败!");
      reset();
      await nextTick();
      getData();
      loading.close();
    });
}

// 时间格式化
function formatTime(create_time) {
  return dayjs(create_time).format("YYYY年MM月DD日HH:mm:ss");
}

//下载文件
function dowFile(row) {
  if (!row.file) return ElMessage.error("文件不存在!");
  $axios
    .post(
      "/file/dowFile",
      {
        name: row.file,
      },
      {
        responseType: "blob",
      }
    )
    .then((response) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = row.name; // 确保这里的文件名是正确的
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // 在点击后移除元素
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      ElMessage.error("下载文件时发生错误!");
    });
}

//转换文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
</script>

<style lang="scss" scoped></style>
