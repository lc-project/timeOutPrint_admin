import axios from "axios";
import useStore from "@/store/modules/userStore.js";
import { baseURL } from "../config.js";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 6000,
});

//请求拦截器
instance.interceptors.request.use(
  function (config) {
    config.headers.authorization = useStore().token ?? "";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (!res) throw new Error("网络错误");
    else return res.data;
  },
  (err) => {
    const res = err.response;
    if (!res) throw new Error("网络错误");
    ElMessage({
      showClose: true,
      message: res.data.message,
      type: "warning",
    });
    if (!res) throw new Error("网络错误");
    const status = res.status;
    //400处理失败 | 442请求体错误 | 500服务器错误响应
    if (status === 400 || status === 442 || status === 500) {
    }
    //token错误
    if (status === 401) {
      //Do something
    }
    //账号被封禁
    if (status === 403) {
      //Do something
    }
    //页面未找到
    if (status === 404) {
      //Do something
    }
    //账号异地登录响应
    if (status === 409) {
      //Do something
    }
    //签sign名错误
    if (status === 401) {
      //Do something
    }
    //频繁请求
    if (status === 429) {
      //Do something
    }
    //服务器超载
    if (status === 503) {
      //Do something
    }
    return Promise.reject(res.data);
  }
);

export default instance;
