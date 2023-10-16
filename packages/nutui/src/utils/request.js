import { axios, PostData, FileData } from "taro-axios";
import Taro from "@tarojs/taro";
import utils from "@/utils/index";

const API_URL = process.env.API;
const getPost = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// 添加请求拦截器
getPost.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 获取登录token
    const TOKEN = Taro.getStorageSync("token");
    // console.log("TOKEN", TOKEN);
    if (TOKEN != "") {
      config.headers.common["Authorization"] = TOKEN;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
getPost.interceptors.response.use(
  function(response) {
    if (response.data.code == 401) {
      // 如果token过期 则登出
      setTimeout(() => {
        utils.user.userLogout(); // 清除旧数据
      }, 500);
      return Promise.reject(response.data);
    } else {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      return response.data;
    }
  },
  function(error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error.message);
  }
);

export { axios, PostData, FileData, getPost };
