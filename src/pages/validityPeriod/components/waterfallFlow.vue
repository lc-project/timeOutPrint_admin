<template>
  <div class="waterfallFlow">
    <el-drawer v-model="pictureShow" title="图片列表" :with-header="false" size="60%" @opened="onOpen">
      <div class="data f">
        <div class="info">
          <div class="infoBox">
            <div class="file">文件数量：{{ file }}</div>
            <div class="notExpired">未过期总数：{{ notExpired }}</div>
            <div class="expired">已过期总数：{{ expired }}</div>
            <div class="classTitle">大类总数：{{ classTitle }}</div>
          </div>
        </div>
        <div class="content">
          <div class="time">
            <el-date-picker v-model="start" type="datetime" placeholder="上传开始时间" format="YYYY/MM/DD hh:mm:ss" value-format="x" />
            <span>~</span>
            <el-date-picker v-model="finish" type="datetime" placeholder="上传截止时间" format="YYYY/MM/DD hh:mm:ss" value-format="x" />
            <el-button type="primary" round style="margin-left: 10px" @click="searchBtn">
              <template #icon>
                <i-search theme="outline" size="24" fill="#fff" />
              </template>
              搜索
            </el-button>
            <el-button round @click="reset">
              <template #icon>
                <i-delete-mode theme="outline" size="24" fill="#000000" />
              </template>
              重置
            </el-button>
          </div>
          <el-empty v-if="pictureForm.length == 0" description="暂无数据" />
          <Waterfall v-else :list="pictureForm" class="imge">
            <template #default="{ item, url, index }">
              <div :class="['card', item.stateTitle === '已过期' ? 'expired' : 'notExpired']">
                <LazyImg class="cardImg" :url="item.url" />
                <div class="overlay ac">
                  <div class="overlayBox">
                    <div class="jb">
                      <div class="classInfo">
                        <span>
                          {{ item.data.categories }}
                        </span>
                      </div>
                      <div class="isExpired">
                        <el-tag v-if="item.stateTitle == '未过期'" round>{{ item.stateTitle }}</el-tag>
                        <el-tag type="danger" v-if="item.stateTitle == '已过期'" round>{{ item.stateTitle }}</el-tag>
                      </div>
                    </div>
                    <div class="materialsInfo">
                      <span>{{ item.data.name }}</span>
                      <span>{{ item.data.storage }}</span>
                      <span>{{ item.data.theTerm }}</span>
                    </div>
                    <div class="timeInfo">
                      <span>上传时间：{{ dayjs(item.uploadTime).format("YY/MM-DD HH:mm") }}</span>
                      <span>到期时间：{{ dayjs(item.data.expireTime).format("YY/MM-DD HH:mm") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Waterfall>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";
import validityPeriod from "../store.js";
const { pictureForm, startTime, finishTime } = storeToRefs(validityPeriod());
const pictureShow = defineModel();

const start = ref("");
const finish = ref("");

function searchBtn() {
  startTime.value = start.value;
  finishTime.value = finish.value;
  if (finishTime.value < startTime.value) {
    ElMessage({
      message: "截止日期不能小于开始日期",
      type: "warning",
    });
  } else {
    validityPeriod().getValidityPeriod();
  }
}
function reset() {
  start.value = "";
  finish.value = "";
  startTime.value = "";
  finishTime.value = "";
  validityPeriod().getValidityPeriod();
}

const file = ref(""); // 上传的文件数量
const notExpired = ref(""); // 未过期数量
const expired = ref(""); // 已过期数量
const classTitle = ref(""); // 物料大类总数

function onOpen() {
  notExpired.value = 0;
  expired.value = 0;
  const categorySet = new Set();
  file.value = pictureForm.value.length;
  pictureForm.value.forEach((item) => {
    if (item.stateTitle === "未过期") {
      notExpired.value++;
    } else if (item.stateTitle === "已过期") {
      expired.value++;
    }
    if (item.data && item.data.categories) {
      categorySet.add(item.data.categories);
    }
  });
  classTitle.value = categorySet.size;
}
</script>

<style lang="scss" scoped>
.waterfallFlow {
  .data {
    width: 100%;
    height: 100%;
    .info {
      width: 10%;
      height: 100%;
      .infoBox {
        font-size: 14px;
        font-weight: 900;
        .file {
          margin-top: 20px;
        }
        .notExpired {
          margin-top: 20px;
        }
        .expired {
          margin-top: 20px;
        }
        .classTitle {
          margin-top: 20px;
        }
      }
    }
    .content {
      width: 90%;
      height: 100%;
      .time {
        margin-left: 10px;
      }
      .imge {
        .card {
          cursor: pointer;
          position: relative;
          margin: auto;
          .cardImg {
            transition: transform 0.3s ease-in-out;
          }
          .overlay {
            width: 100%;
            height: 30%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1));
            position: absolute;
            bottom: 0;
            left: 0;
            color: white;
            font-size: 11px;
            .overlayBox {
              position: absolute;
              bottom: 15px;
              left: 0px;
              .classInfo {
                span {
                  margin-left: 10px;
                }
              }
              .materialsInfo {
                margin-top: 10px;
                span {
                  margin-left: 10px;
                }
              }
              .timeInfo {
                margin-top: 10px;
                span {
                  margin-left: 10px;
                }
              }
            }
          }
        }
        .expired {
          box-shadow: 0 0 20px 0 red;
          border: 2px solid red;
        }
        .notExpired {
          border: 1px solid rgba(14, 13, 13, 0.5);
        }
      }
    }
  }
}
</style>
