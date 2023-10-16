import Taro from "@tarojs/taro";

// 获取并使用全局变量 "x"
const getValue = () => Taro.getApp();


export { getValue };
