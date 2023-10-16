import Taro from "@tarojs/taro";
import utils from "./index";
import {useSystemStore,useCartStore} from "@/store/index";
import api from "@/api/index";

// 登录
const userLogin = (params, fn) => {
  const systemStore = useSystemStore();
  // console.log(utils);
  // 微信获取用户授权后登录 正式环境已失效 无法获取有效信息
  utils.wxLogin.wxUserinfo(()=>{

    utils.wxLogin.Login((code) => {
      api.wxLogin({ code: code }).then((res) => {
        console.log("用户登录成功");
        // console.log(res.data);
        // 设置token
        Taro.setStorageSync("token", res.data.token);
        // 获取用户信息
        systemStore.getUserInfo();
        getUserData();
        fn && fn(arguments);
      }).catch(err=>{
        // 演示token
        Taro.setStorageSync("token", 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImUxM2NiYTc4LTUxOGMtNDJjMC04OGJkLWNkZWIzNGYzZmI3ZSJ9.qeIm8L4wwdgA5GYL32IXlVBRq1pWOLF8CvQ-1fEwVn7JvzXzbtVGgIpfAkHbk4N9lN6wsIHHFow1MHfAHlxhGA');
        // 获取用户信息
        systemStore.getUserInfo();
        getUserData();
        fn && fn(arguments);
      });
    });

  });
};

// 获取用户相关数据 路由切换时会反复执行
const getUserData = (price=false) => {
  const cartStore = useCartStore();
  // 获取用户购物车列表
  cartStore.getList();
};

// 退出登录
const userLogout = () => {
  const systemStore = useSystemStore();
  const cartStore = useCartStore();
  systemStore.$reset();// 还原系统数据
  cartStore.$reset(); // 还原购物车数据
  systemStore.clear(); // 清空保存的数据
  systemStore.user = null;
  utils.router.goHomeRelaunch();
  console.log('用户退出成功');
};

export { userLogin, getUserData, userLogout };
