import Taro from "@tarojs/taro";

// 获取并使用全局变量 "version"
const getValue = () => Taro.getApp();


export { getValue };
