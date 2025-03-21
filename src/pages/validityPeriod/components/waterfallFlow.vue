<template>
  <div class="waterfallFlow">
    <el-drawer v-model="pictureShow" title="图片列表" :with-header="false" size="60%">
      <div class="data f">
        <div class="info">
          <div class="infoBox">1212</div>
        </div>
        <div class="content">
          <div class="time">
            <el-date-picker v-model="start" type="datetime" placeholder="选择开始时间" format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" />
            <span>~</span>
            <el-date-picker v-model="finish" type="datetime" placeholder="选择截止时间" format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" />
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
          <Waterfall :list="pictureForm" class="imge">
            <template #default="{ item, url, index }">
              <div class="card">
                <LazyImg class="cardImg" :url="item.url" />
                <div class="overlay ac">
                  <div class="overlayBox">
                    <div class="name">{{ item.fileName }}</div>
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
import { onMounted, ref } from "vue";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";
import validityPeriod from "../store.js";
const { pictureForm, startTime, finishTime } = storeToRefs(validityPeriod());
const pictureShow = defineModel();

const start = ref("");
const finish = ref("");

function searchBtn() {
  console.log("%c Line:59 🥝 start.value", "background:#ffdd4d", start.value);
  console.log("%c Line:61 🍭 finish.value", "background:#b03734", finish.value);

  return;
  startTime.value = start.value;
  finishTime.value = finish.value;
  validityPeriod().getValidityPeriod();
}
function reset() {
  start.value = "";
  finish.value = "";
  validityPeriod().getValidityPeriod();
}
</script>

<style lang="scss" scoped>
.waterfallFlow {
  .data {
    display: flex;
    width: 100%;
    height: 100%;
    .info {
      width: 10%;
      height: 100%;
      padding: 15px;
      border-radius: 10px;
      background-color: #dfeaf5;
    }
    .content {
      width: 90%;
      .time {
        margin-left: 10px;
      }
      .imge {
        .card {
          cursor: pointer;
          position: relative;
          margin: auto;
          overflow: hidden;
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
            font-size: 12px;
            .overlayBox {
              position: absolute;
              bottom: 25px;
              left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
