import Taro from "@tarojs/taro";
import { useSystemStore } from "@/store/index";

// 微信默认头像
const defaultAvatarUrl =
  "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";

// 默认用户信息
/* 用户没授权使用微信信息则返回该信息 */
const defaultUser = {
  avatarUrl: defaultAvatarUrl,
  city: "",
  country: "",
  gender: 0,
  language: "zh_CN",
  nickName: "微信用户",
  province: "",
};

//已废弃 头像昵称已被官方调整 已无法获取正常数据
const wxUserinfo = (fn) => {
  Taro.getUserProfile({
    desc: "用于展示个人信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      const { userInfo } = res;
      // console.log("userInfo", userInfo);
      const systemStore = useSystemStore();
      systemStore.setUserInfo(userInfo);
      fn && fn();
    },
    fail: function () {
      console.log("获取用户信息失败");
    },
  });
};

const hasToken = () => {
  // 获取登录token
  try {
    const TOKEN = Taro.getStorageSync("token");
    // console.log('TOKEN', TOKEN);
    if (TOKEN != "") {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    // Do something when catch error
    console.log("用户获取授权TOKEN错误");
    return false;
  }
};

const Login = (fn) => {
  // console.log('wxLogin');
  /********* 使用微信登录 *********** */
  // console.log(store);
  Taro.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        fn && fn(res.code);
      } else {
        console.log("登录失败！" + res.errMsg);
      }
    },
  });

  // console.log("hasLogin", hasLogin);
};

// 是否初始空白用户
const isBlankUser = () => {
  const systemStore = useSystemStore();
  const loginUser = systemStore.user;
  // 等于默认头像和默认昵称
  if (
    defaultUser.nickName == '' ||
    defaultUser.nickName == loginUser.nickName ||
    defaultUser.avatarUrl == loginUser.avatarUrl
  ) {
    return true;
  }
  return false;
};

export {
  Login,
  hasToken,
  wxUserinfo,
  defaultAvatarUrl,
  defaultUser,
  isBlankUser,
};
